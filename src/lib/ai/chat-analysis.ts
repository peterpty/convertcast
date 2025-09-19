// AI-powered chat analysis for sales conversion and engagement
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  id: string;
  message: string;
  viewer_id: string;
  stream_id: string;
  sent_at: string;
}

export interface AIAnalysisResult {
  sentiment_score: number; // -1.0 to 1.0
  purchase_intent_score: number; // 0.0 to 1.0
  urgency_score: number; // 0.0 to 1.0
  engagement_score: number; // 0.0 to 1.0
  detected_entities: string[];
  conversation_topics: string[];
  objection_signals: string[];
  buying_signals: string[];
  ai_analysis: {
    summary: string;
    key_insights: string[];
    emotional_state: string;
    conversion_probability: number;
    recommended_response_tone: string;
  };
}

export interface AISuggestion {
  suggestion_type: 'sales_opportunity' | 'objection_handling' | 'engagement_boost' | 'product_recommendation';
  suggestion_text: string;
  confidence_score: number;
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  reasoning: string;
  context_data: Record<string, any>;
  behavioral_triggers: string[];
  recommended_actions: string[];
  suggested_response?: string;
  suggested_offer?: string;
  suggested_registration_link: boolean;
}

export class ChatAnalysisAI {
  private readonly systemPrompt = `
    You are an AI sales assistant analyzing live stream chat messages for conversion opportunities.

    Your role is to:
    1. Analyze chat messages for purchase intent, sentiment, and engagement
    2. Identify buying signals and objection patterns
    3. Generate actionable suggestions for streamers to improve conversions
    4. Recognize emotional states and appropriate response strategies

    Context: This is a live webinar/streaming platform where:
    - Streamers are trying to sell products/services
    - Viewers are potential customers watching and chatting
    - Real-time interaction is crucial for conversions
    - Timing of sales interventions matters significantly

    Analyze each message holistically considering:
    - Direct buying signals (price questions, interest statements)
    - Indirect signals (engagement patterns, question types)
    - Emotional indicators (urgency, hesitation, excitement)
    - Objection patterns (price concerns, feature questions, trust issues)
    - Social proof opportunities (testimonials, case studies needed)

    Be concise but actionable in your recommendations.
  `;

  async analyzeMessage(message: ChatMessage): Promise<AIAnalysisResult> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.systemPrompt },
          {
            role: 'user',
            content: `Analyze this chat message for sales conversion potential:

            Message: "${message.message}"
            Timestamp: ${message.sent_at}

            Provide a JSON response with the following structure:
            {
              "sentiment_score": number (-1.0 to 1.0),
              "purchase_intent_score": number (0.0 to 1.0),
              "urgency_score": number (0.0 to 1.0),
              "engagement_score": number (0.0 to 1.0),
              "detected_entities": string[],
              "conversation_topics": string[],
              "objection_signals": string[],
              "buying_signals": string[],
              "ai_analysis": {
                "summary": "Brief analysis summary",
                "key_insights": string[],
                "emotional_state": "excited|interested|hesitant|skeptical|neutral",
                "conversion_probability": number (0.0 to 1.0),
                "recommended_response_tone": "enthusiastic|informative|reassuring|urgent|casual"
              }
            }`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to basic analysis
      return this.basicAnalysis(message);
    }
  }

  async generateSuggestions(
    message: ChatMessage,
    analysis: AIAnalysisResult,
    viewerContext?: any
  ): Promise<AISuggestion[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.systemPrompt },
          {
            role: 'user',
            content: `Based on this message analysis, generate actionable suggestions for the streamer:

            Message: "${message.message}"
            Analysis: ${JSON.stringify(analysis)}
            Viewer Context: ${JSON.stringify(viewerContext || {})}

            Generate 1-3 specific, actionable suggestions. For each suggestion, provide:
            {
              "suggestion_type": "sales_opportunity|objection_handling|engagement_boost|product_recommendation",
              "suggestion_text": "Clear, actionable suggestion for the streamer",
              "confidence_score": number (0.0 to 1.0),
              "priority_level": "low|medium|high|urgent",
              "reasoning": "Why this suggestion makes sense",
              "context_data": {...},
              "behavioral_triggers": string[],
              "recommended_actions": string[],
              "suggested_response": "Optional direct response text",
              "suggested_offer": "Optional specific offer to make",
              "suggested_registration_link": boolean
            }

            Return as JSON array of suggestions.`
          }
        ],
        temperature: 0.4,
        max_tokens: 1500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        return [];
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('AI suggestions error:', error);
      return this.generateBasicSuggestions(message, analysis);
    }
  }

  private basicAnalysis(message: ChatMessage): AIAnalysisResult {
    const text = message.message.toLowerCase();

    // Basic keyword-based analysis
    const buyingKeywords = ['buy', 'purchase', 'price', 'cost', 'how much', 'order', 'sign up'];
    const engagementKeywords = ['interesting', 'great', 'awesome', 'love', 'like', 'question'];
    const objectionKeywords = ['expensive', 'too much', 'not sure', 'maybe', 'think about it'];

    const purchase_intent_score = buyingKeywords.some(keyword => text.includes(keyword)) ? 0.7 : 0.2;
    const engagement_score = engagementKeywords.some(keyword => text.includes(keyword)) ? 0.8 : 0.3;
    const objection_detected = objectionKeywords.some(keyword => text.includes(keyword));

    return {
      sentiment_score: objection_detected ? -0.2 : 0.5,
      purchase_intent_score,
      urgency_score: text.includes('now') || text.includes('today') ? 0.8 : 0.3,
      engagement_score,
      detected_entities: [],
      conversation_topics: [],
      objection_signals: objection_detected ? ['price_concern'] : [],
      buying_signals: purchase_intent_score > 0.5 ? ['direct_inquiry'] : [],
      ai_analysis: {
        summary: 'Basic keyword-based analysis',
        key_insights: [],
        emotional_state: 'neutral',
        conversion_probability: purchase_intent_score,
        recommended_response_tone: 'informative',
      },
    };
  }

  private generateBasicSuggestions(message: ChatMessage, analysis: AIAnalysisResult): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    if (analysis.purchase_intent_score > 0.6) {
      suggestions.push({
        suggestion_type: 'sales_opportunity',
        suggestion_text: 'High purchase intent detected! Consider offering a direct purchase link or special discount.',
        confidence_score: analysis.purchase_intent_score,
        priority_level: analysis.purchase_intent_score > 0.8 ? 'urgent' : 'high',
        reasoning: 'Message indicates strong buying interest',
        context_data: { purchase_intent: analysis.purchase_intent_score },
        behavioral_triggers: ['purchase_intent'],
        recommended_actions: ['send_purchase_link', 'offer_discount'],
        suggested_registration_link: true,
      });
    }

    if (analysis.objection_signals.length > 0) {
      suggestions.push({
        suggestion_type: 'objection_handling',
        suggestion_text: 'Address price concerns with value proposition or testimonials.',
        confidence_score: 0.7,
        priority_level: 'medium',
        reasoning: 'Objection signals detected in message',
        context_data: { objections: analysis.objection_signals },
        behavioral_triggers: ['objection_signals'],
        recommended_actions: ['address_objection', 'show_value'],
        suggested_registration_link: false,
      });
    }

    return suggestions;
  }

  async saveAnalysisToDatabase(messageId: string, analysis: AIAnalysisResult): Promise<void> {
    try {
      await supabase
        .from('stream_chat_messages')
        .update({
          sentiment_score: analysis.sentiment_score,
          purchase_intent_score: analysis.purchase_intent_score,
          urgency_score: analysis.urgency_score,
          engagement_score: analysis.engagement_score,
          detected_entities: analysis.detected_entities,
          conversation_topics: analysis.conversation_topics,
          objection_signals: analysis.objection_signals,
          buying_signals: analysis.buying_signals,
          ai_analysis: analysis.ai_analysis,
          processed_at: new Date().toISOString(),
        })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error saving analysis to database:', error);
    }
  }

  async saveSuggestionsToDatabase(
    streamId: string,
    viewerId: string,
    messageId: string,
    suggestions: AISuggestion[]
  ): Promise<void> {
    try {
      const suggestionRows = suggestions.map(suggestion => ({
        stream_id: streamId,
        viewer_id: viewerId,
        message_id: messageId,
        suggestion_type: suggestion.suggestion_type,
        suggestion_text: suggestion.suggestion_text,
        confidence_score: suggestion.confidence_score,
        priority_level: suggestion.priority_level,
        reasoning: suggestion.reasoning,
        context_data: suggestion.context_data,
        behavioral_triggers: suggestion.behavioral_triggers,
        recommended_actions: suggestion.recommended_actions,
        suggested_response: suggestion.suggested_response,
        suggested_offer: suggestion.suggested_offer,
        suggested_registration_link: suggestion.suggested_registration_link,
      }));

      await supabase
        .from('ai_chat_suggestions')
        .insert(suggestionRows);
    } catch (error) {
      console.error('Error saving suggestions to database:', error);
    }
  }
}

// Behavioral analysis for viewer conversion scoring
export class BehaviorAnalysisAI {
  async analyzeViewerBehavior(viewerId: string): Promise<{
    conversion_score: number;
    behavioral_insights: Record<string, any>;
    recommendations: string[];
  }> {
    try {
      // Get viewer behavior data
      const { data: viewer } = await supabase
        .from('stream_viewers')
        .select(`
          *,
          behavior_events:viewer_behavior_events(*),
          chat_messages:stream_chat_messages(*)
        `)
        .eq('id', viewerId)
        .single();

      if (!viewer) {
        throw new Error('Viewer not found');
      }

      // Calculate conversion score based on multiple factors
      const durationScore = Math.min(viewer.duration_seconds / 1800, 1.0) * 0.3; // Max 30min = 0.3
      const engagementScore = Math.min(viewer.interactions_count / 10, 1.0) * 0.3; // Max 10 interactions = 0.3
      const chatScore = viewer.chat_messages?.length > 0 ? 0.2 : 0;
      const behaviorScore = viewer.behavior_events?.length > 5 ? 0.2 : 0.1; // Active behavior = 0.2

      const conversion_score = durationScore + engagementScore + chatScore + behaviorScore;

      const behavioral_insights = {
        viewing_duration: viewer.duration_seconds,
        interaction_frequency: viewer.interactions_count,
        chat_participation: viewer.chat_messages?.length || 0,
        page_engagement: viewer.behavior_events?.length || 0,
        device_type: viewer.device_type,
        engagement_pattern: this.analyzeEngagementPattern(viewer.behavior_events || []),
      };

      const recommendations = this.generateBehaviorRecommendations(conversion_score, behavioral_insights);

      // Update viewer record with new conversion score
      await supabase
        .from('stream_viewers')
        .update({
          conversion_score,
          ai_analysis: behavioral_insights,
          ai_recommendations: recommendations,
        })
        .eq('id', viewerId);

      return {
        conversion_score,
        behavioral_insights,
        recommendations,
      };
    } catch (error) {
      console.error('Behavior analysis error:', error);
      return {
        conversion_score: 0.0,
        behavioral_insights: {},
        recommendations: [],
      };
    }
  }

  private analyzeEngagementPattern(events: any[]): string {
    if (events.length === 0) return 'passive';

    const recentEvents = events.filter(e =>
      new Date(e.occurred_at).getTime() > Date.now() - 5 * 60 * 1000 // Last 5 minutes
    );

    if (recentEvents.length > 3) return 'highly_active';
    if (recentEvents.length > 1) return 'active';
    if (events.length > 5) return 'moderately_active';
    return 'passive';
  }

  private generateBehaviorRecommendations(score: number, insights: any): string[] {
    const recommendations: string[] = [];

    if (score > 0.7) {
      recommendations.push('High conversion potential - prioritize immediate engagement');
      recommendations.push('Consider direct sales approach or special offer');
    } else if (score > 0.4) {
      recommendations.push('Moderate interest - nurture with valuable content');
      recommendations.push('Engage with questions or interactive elements');
    } else {
      recommendations.push('Low engagement - use attention-grabbing techniques');
      recommendations.push('Provide compelling value proposition');
    }

    if (insights.chat_participation === 0) {
      recommendations.push('No chat participation - encourage interaction');
    }

    if (insights.viewing_duration < 300) { // Less than 5 minutes
      recommendations.push('Short viewing time - hook them quickly');
    }

    return recommendations;
  }
}

// Export singleton instances
export const chatAnalysisAI = new ChatAnalysisAI();
export const behaviorAnalysisAI = new BehaviorAnalysisAI();