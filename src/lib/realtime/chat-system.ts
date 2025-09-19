// Real-time chat system with AI integration for live streams
import { io, Socket } from 'socket.io-client';
import { supabase } from '@/lib/supabase';
import { chatAnalysisAI, behaviorAnalysisAI } from '@/lib/ai/chat-analysis';

export interface StreamChatMessage {
  id: string;
  stream_id: string;
  viewer_id: string;
  message: string;
  message_type: 'text' | 'emoji' | 'system' | 'ai_suggestion' | 'streamer_response';
  sent_at: string;
  viewer_name?: string;
  sentiment_score?: number;
  purchase_intent_score?: number;
  ai_analysis?: any;
}

export interface AISuggestionAlert {
  id: string;
  suggestion_type: string;
  suggestion_text: string;
  confidence_score: number;
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  viewer_id: string;
  viewer_name?: string;
  reasoning: string;
  suggested_response?: string;
  suggested_offer?: string;
  expires_at: string;
}

export interface ViewerConversionAlert {
  viewer_id: string;
  viewer_name?: string;
  conversion_score: number;
  behavioral_insights: any;
  recommendations: string[];
  trigger_event: string;
}

export class StreamChatSystem {
  private socket: Socket | null = null;
  private streamId: string | null = null;
  private viewerId: string | null = null;
  private isStreamer: boolean = false;
  private messageHandlers: Array<(message: StreamChatMessage) => void> = [];
  private suggestionHandlers: Array<(suggestion: AISuggestionAlert) => void> = [];
  private conversionHandlers: Array<(alert: ViewerConversionAlert) => void> = [];

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    // Initialize Socket.IO connection for real-time features
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001', {
      transports: ['websocket'],
      autoConnect: false,
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    this.socket.on('chat_message', (message: StreamChatMessage) => {
      this.handleIncomingMessage(message);
    });

    this.socket.on('ai_suggestion', (suggestion: AISuggestionAlert) => {
      this.handleAISuggestion(suggestion);
    });

    this.socket.on('conversion_alert', (alert: ViewerConversionAlert) => {
      this.handleConversionAlert(alert);
    });
  }

  async joinStream(streamId: string, viewerId: string, isStreamer: boolean = false) {
    this.streamId = streamId;
    this.viewerId = viewerId;
    this.isStreamer = isStreamer;

    if (!this.socket?.connected) {
      this.socket?.connect();
    }

    // Join the stream room
    this.socket?.emit('join_stream', {
      streamId,
      viewerId,
      isStreamer,
    });

    // Load recent chat history
    await this.loadChatHistory();

    // Track viewer behavior if not streamer
    if (!isStreamer) {
      this.startBehaviorTracking();
    }
  }

  async leaveStream() {
    if (this.streamId && this.socket?.connected) {
      this.socket.emit('leave_stream', {
        streamId: this.streamId,
        viewerId: this.viewerId,
      });
    }

    this.streamId = null;
    this.viewerId = null;
    this.isStreamer = false;
    this.socket?.disconnect();
  }

  async sendMessage(message: string, messageType: 'text' | 'emoji' = 'text') {
    if (!this.streamId || !this.viewerId || !this.socket?.connected) {
      throw new Error('Not connected to stream');
    }

    const chatMessage: Partial<StreamChatMessage> = {
      stream_id: this.streamId,
      viewer_id: this.viewerId,
      message,
      message_type: messageType,
      sent_at: new Date().toISOString(),
    };

    // Save to database
    const { data, error } = await supabase
      .from('stream_chat_messages')
      .insert(chatMessage)
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    // Emit to real-time system
    this.socket.emit('send_message', data);

    // Trigger AI analysis for non-streamer messages
    if (!this.isStreamer && messageType === 'text') {
      this.processMessageWithAI(data);
    }

    // Track behavior event
    this.trackBehaviorEvent('message_sent', { message_length: message.length });

    return data;
  }

  private async processMessageWithAI(message: StreamChatMessage) {
    try {
      // Analyze message with AI
      const analysis = await chatAnalysisAI.analyzeMessage(message);

      // Save analysis to database
      await chatAnalysisAI.saveAnalysisToDatabase(message.id, analysis);

      // Generate suggestions if high intent detected
      if (analysis.purchase_intent_score > 0.5 || analysis.urgency_score > 0.6) {
        const viewerContext = await this.getViewerContext(message.viewer_id);
        const suggestions = await chatAnalysisAI.generateSuggestions(
          message,
          analysis,
          viewerContext
        );

        if (suggestions.length > 0) {
          await chatAnalysisAI.saveSuggestionsToDatabase(
            message.stream_id,
            message.viewer_id,
            message.id,
            suggestions
          );

          // Notify streamer of high-priority suggestions
          const urgentSuggestions = suggestions.filter(s => s.priority_level === 'urgent' || s.priority_level === 'high');
          for (const suggestion of urgentSuggestions) {
            this.notifyStreamerOfSuggestion(suggestion, message);
          }
        }
      }

      // Update viewer conversion score
      this.updateViewerConversionScore(message.viewer_id);
    } catch (error) {
      console.error('AI processing error:', error);
    }
  }

  private async getViewerContext(viewerId: string) {
    const { data } = await supabase
      .from('stream_viewers')
      .select(`
        *,
        recent_messages:stream_chat_messages(*)
      `)
      .eq('id', viewerId)
      .single();

    return data;
  }

  private notifyStreamerOfSuggestion(suggestion: any, message: StreamChatMessage) {
    const alert: AISuggestionAlert = {
      id: suggestion.id || crypto.randomUUID(),
      suggestion_type: suggestion.suggestion_type,
      suggestion_text: suggestion.suggestion_text,
      confidence_score: suggestion.confidence_score,
      priority_level: suggestion.priority_level,
      viewer_id: message.viewer_id,
      viewer_name: message.viewer_name,
      reasoning: suggestion.reasoning,
      suggested_response: suggestion.suggested_response,
      suggested_offer: suggestion.suggested_offer,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    };

    // Emit to streamer
    this.socket?.emit('ai_suggestion_alert', {
      streamId: this.streamId,
      suggestion: alert,
    });
  }

  private async updateViewerConversionScore(viewerId: string) {
    try {
      const analysis = await behaviorAnalysisAI.analyzeViewerBehavior(viewerId);

      // If conversion score crosses threshold, alert streamer
      if (analysis.conversion_score > 0.7) {
        const { data: viewer } = await supabase
          .from('stream_viewers')
          .select('*')
          .eq('id', viewerId)
          .single();

        if (viewer) {
          const alert: ViewerConversionAlert = {
            viewer_id: viewerId,
            viewer_name: `${viewer.first_name || 'Anonymous'} ${viewer.last_name || 'Viewer'}`,
            conversion_score: analysis.conversion_score,
            behavioral_insights: analysis.behavioral_insights,
            recommendations: analysis.recommendations,
            trigger_event: 'high_conversion_score',
          };

          this.socket?.emit('conversion_alert', {
            streamId: this.streamId,
            alert,
          });
        }
      }
    } catch (error) {
      console.error('Error updating conversion score:', error);
    }
  }

  private async loadChatHistory() {
    if (!this.streamId) return;

    try {
      const { data: messages } = await supabase
        .from('stream_chat_messages')
        .select('*')
        .eq('stream_id', this.streamId)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (messages) {
        // Reverse to show oldest first
        messages.reverse().forEach(message => {
          this.handleIncomingMessage(message as StreamChatMessage);
        });
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  private startBehaviorTracking() {
    if (!this.viewerId || !this.streamId) return;

    // Track page view
    this.trackBehaviorEvent('page_view');

    // Track scroll events
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackBehaviorEvent('scroll', {
          scroll_position: window.scrollY,
          page_height: document.body.scrollHeight,
        });
      }, 1000);
    });

    // Track clicks on interactive elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-track]')) {
        this.trackBehaviorEvent('click', {
          element: target.closest('[data-track]')?.getAttribute('data-track'),
          timestamp: Date.now(),
        });
      }
    });

    // Track time to first interaction
    let firstInteraction = false;
    const interactionEvents = ['click', 'keydown', 'scroll'];
    const handleFirstInteraction = () => {
      if (!firstInteraction) {
        firstInteraction = true;
        this.trackBehaviorEvent('first_interaction', {
          time_to_interaction: Date.now() - this.joinTime,
        });
        interactionEvents.forEach(event => {
          document.removeEventListener(event, handleFirstInteraction);
        });
      }
    };

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleFirstInteraction);
    });
  }

  private joinTime = Date.now();

  private async trackBehaviorEvent(eventType: string, eventData: any = {}) {
    if (!this.viewerId || !this.streamId || this.isStreamer) return;

    try {
      await supabase
        .from('viewer_behavior_events')
        .insert({
          viewer_id: this.viewerId,
          stream_id: this.streamId,
          event_type: eventType,
          event_data: eventData,
          page_url: window.location.href,
          timestamp_offset_seconds: Math.floor((Date.now() - this.joinTime) / 1000),
        });
    } catch (error) {
      console.error('Error tracking behavior event:', error);
    }
  }

  // Event handlers
  private handleIncomingMessage(message: StreamChatMessage) {
    this.messageHandlers.forEach(handler => handler(message));
  }

  private handleAISuggestion(suggestion: AISuggestionAlert) {
    if (this.isStreamer) {
      this.suggestionHandlers.forEach(handler => handler(suggestion));
    }
  }

  private handleConversionAlert(alert: ViewerConversionAlert) {
    if (this.isStreamer) {
      this.conversionHandlers.forEach(handler => handler(alert));
    }
  }

  // Public event subscription methods
  onMessage(handler: (message: StreamChatMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) this.messageHandlers.splice(index, 1);
    };
  }

  onAISuggestion(handler: (suggestion: AISuggestionAlert) => void) {
    this.suggestionHandlers.push(handler);
    return () => {
      const index = this.suggestionHandlers.indexOf(handler);
      if (index > -1) this.suggestionHandlers.splice(index, 1);
    };
  }

  onConversionAlert(handler: (alert: ViewerConversionAlert) => void) {
    this.conversionHandlers.push(handler);
    return () => {
      const index = this.conversionHandlers.indexOf(handler);
      if (index > -1) this.conversionHandlers.splice(index, 1);
    };
  }

  // Streamer actions
  async respondToSuggestion(suggestionId: string, response: string, actionTaken?: string) {
    if (!this.isStreamer) return;

    try {
      await supabase
        .from('ai_chat_suggestions')
        .update({
          is_acted_upon: true,
          streamer_response: response,
          action_taken: actionTaken,
          acted_at: new Date().toISOString(),
        })
        .eq('id', suggestionId);

      // Send response as message if provided
      if (response.trim()) {
        await this.sendMessage(response, 'streamer_response');
      }
    } catch (error) {
      console.error('Error responding to suggestion:', error);
    }
  }

  async generateRegistrationLink(viewerId?: string): Promise<string> {
    const baseUrl = window.location.origin;
    const streamUrl = `${baseUrl}/watch/${this.streamId}`;

    if (viewerId) {
      // Personalized link with tracking
      return `${streamUrl}?ref=${viewerId}&utm_source=chat&utm_medium=direct`;
    }

    return streamUrl;
  }

  async sendRegistrationLink(viewerId: string, customMessage?: string) {
    if (!this.isStreamer) return;

    const link = await this.generateRegistrationLink(viewerId);
    const message = customMessage || `Here's your direct link to join: ${link}`;

    await this.sendMessage(message, 'streamer_response');

    // Track that a registration link was sent
    this.trackBehaviorEvent('registration_link_sent', {
      target_viewer: viewerId,
      link: link,
    });
  }
}

// Export singleton instance
export const streamChatSystem = new StreamChatSystem();