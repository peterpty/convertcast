'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { streamChatSystem, AISuggestionAlert, ViewerConversionAlert } from '@/lib/realtime/chat-system';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Square,
  Users,
  MessageSquare,
  TrendingUp,
  Zap,
  ExternalLink,
  Send,
  AlertTriangle,
  Target,
  Brain,
  Eye,
  DollarSign,
  Clock,
  Settings,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamStats {
  concurrent_viewers: number;
  total_viewers: number;
  chat_messages: number;
  conversion_events: number;
  revenue_cents: number;
  average_watch_time: number;
}

interface LiveStream {
  id: string;
  title: string;
  description: string;
  status: 'created' | 'live' | 'ended' | 'error';
  stream_key: string;
  stream_url: string;
  started_at?: string;
  ended_at?: string;
  peak_viewers: number;
  total_viewers: number;
  enable_ai_chat: boolean;
  ai_sales_mode: boolean;
}

export function StreamerDashboard() {
  const { user } = useAuth();
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [stats, setStats] = useState<StreamStats>({
    concurrent_viewers: 0,
    total_viewers: 0,
    chat_messages: 0,
    conversion_events: 0,
    revenue_cents: 0,
    average_watch_time: 0,
  });
  const [chatMessage, setChatMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionAlert[]>([]);
  const [conversionAlerts, setConversionAlerts] = useState<ViewerConversionAlert[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Stream controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadActiveStream();
    }
  }, [user]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, []);

  const loadActiveStream = async () => {
    try {
      const { data } = await supabase
        .from('live_streams')
        .select('*')
        .eq('streamer_id', user?.id)
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setStream(data);
        connectToStream(data.id);
      }
    } catch (error) {
      console.error('Error loading stream:', error);
    }
  };

  const connectToStream = async (streamId: string) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      await streamChatSystem.joinStream(streamId, user?.id || '', true);

      // Subscribe to AI suggestions
      streamChatSystem.onAISuggestion((suggestion) => {
        setAiSuggestions(prev => [suggestion, ...prev.slice(0, 9)]); // Keep last 10
      });

      // Subscribe to conversion alerts
      streamChatSystem.onConversionAlert((alert) => {
        setConversionAlerts(prev => [alert, ...prev.slice(0, 4)]); // Keep last 5
      });

      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error connecting to stream:', error);
      setConnectionStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  };

  const startStream = async () => {
    if (!user) return;

    try {
      setIsConnecting(true);

      // Create new stream
      const { data: newStream, error } = await supabase
        .from('live_streams')
        .insert({
          streamer_id: user.id,
          title: `Live Stream - ${new Date().toLocaleDateString()}`,
          description: 'Live streaming session',
          stream_key: crypto.randomUUID(),
          enable_ai_chat: true,
          ai_sales_mode: true,
          status: 'live',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setStream(newStream);
      await connectToStream(newStream.id);
    } catch (error) {
      console.error('Error starting stream:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const endStream = async () => {
    if (!stream) return;

    try {
      await supabase
        .from('live_streams')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
        })
        .eq('id', stream.id);

      await streamChatSystem.leaveStream();
      setStream(null);
      setConnectionStatus('disconnected');
    } catch (error) {
      console.error('Error ending stream:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    try {
      await streamChatSystem.sendMessage(chatMessage);
      setChatMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAISuggestion = async (suggestion: AISuggestionAlert, action: 'accept' | 'dismiss') => {
    if (action === 'accept' && suggestion.suggested_response) {
      await streamChatSystem.respondToSuggestion(
        suggestion.id,
        suggestion.suggested_response,
        'accepted_suggestion'
      );
    } else {
      await streamChatSystem.respondToSuggestion(
        suggestion.id,
        '',
        'dismissed_suggestion'
      );
    }

    // Remove from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const sendRegistrationLink = async (viewerId: string) => {
    await streamChatSystem.sendRegistrationLink(viewerId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Live Streaming Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your live stream with AI-powered insights</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className={cn(
                "text-sm font-medium",
                connectionStatus === 'connected' ? "text-green-500" : "text-red-500"
              )}>
                {connectionStatus.toUpperCase()}
              </span>
            </div>

            {/* Stream Controls */}
            {!stream ? (
              <Button
                onClick={startStream}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {isConnecting ? 'Starting...' : 'Go Live'}
              </Button>
            ) : (
              <Button
                onClick={endStream}
                variant="destructive"
              >
                <Square className="w-4 h-4 mr-2" />
                End Stream
              </Button>
            )}
          </div>
        </div>

        {stream && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.concurrent_viewers}</p>
                      <p className="text-sm text-slate-400">Live Viewers</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.total_viewers}</p>
                      <p className="text-sm text-slate-400">Total Viewers</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Target className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.conversion_events}</p>
                      <p className="text-sm text-slate-400">Conversions</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold text-white">{formatCurrency(stats.revenue_cents)}</p>
                      <p className="text-sm text-slate-400">Revenue</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Stream Controls */}
              <Card className="p-6 bg-slate-800 border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Stream Controls
                </h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={isMuted ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  <Button
                    variant={isVideoOff ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </Button>

                  <Button
                    variant={isScreenSharing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                  </Button>
                </div>
              </Card>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <Card className="p-6 bg-slate-800 border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-500" />
                    AI Sales Suggestions
                  </h3>
                  <div className="space-y-3">
                    {aiSuggestions.slice(0, 3).map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-4 border border-slate-600 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge className={cn("text-xs", getPriorityColor(suggestion.priority_level))}>
                              {suggestion.priority_level.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {suggestion.viewer_name} • {suggestion.confidence_score * 100}% confidence
                            </span>
                          </div>
                          <Clock className="w-4 h-4 text-slate-400" />
                        </div>

                        <p className="text-white mb-3">{suggestion.suggestion_text}</p>

                        {suggestion.suggested_response && (
                          <div className="p-3 bg-slate-700 rounded mb-3">
                            <p className="text-sm text-slate-300">{suggestion.suggested_response}</p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAISuggestion(suggestion, 'accept')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept & Send
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAISuggestion(suggestion, 'dismiss')}
                          >
                            Dismiss
                          </Button>
                          {suggestion.viewer_id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendRegistrationLink(suggestion.viewer_id)}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Send Link
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Conversion Alerts */}
              {conversionAlerts.length > 0 && (
                <Card className="p-6 bg-slate-800 border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    High-Value Viewers
                  </h3>
                  <div className="space-y-3">
                    {conversionAlerts.slice(0, 2).map((alert, index) => (
                      <div
                        key={index}
                        className="p-4 border border-green-600 rounded-lg bg-green-950/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{alert.viewer_name}</h4>
                          <Badge className="bg-green-600 text-white">
                            {Math.round(alert.conversion_score * 100)}% conversion score
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-300 space-y-1">
                          {alert.recommendations.slice(0, 2).map((rec, i) => (
                            <p key={i}>• {rec}</p>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          className="mt-3 bg-green-600 hover:bg-green-700"
                          onClick={() => sendRegistrationLink(alert.viewer_id)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Engage Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Sidebar - Chat */}
            <div className="space-y-6">
              <Card className="p-4 bg-slate-800 border-slate-700 h-96">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Live Chat
                </h3>

                <div
                  ref={chatMessagesRef}
                  className="h-64 overflow-y-auto mb-4 space-y-2"
                >
                  {/* Chat messages would be rendered here */}
                  <div className="text-sm text-slate-400 text-center">
                    Chat messages will appear here...
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Send a message..."
                    className="bg-slate-700 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <Button size="sm" onClick={sendChatMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Stream Info */}
              <Card className="p-4 bg-slate-800 border-slate-700">
                <h3 className="text-lg font-semibold mb-4">Stream Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Stream Key</p>
                    <p className="font-mono text-xs bg-slate-700 p-2 rounded">
                      {stream.stream_key}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Started</p>
                    <p className="text-white">
                      {stream.started_at ? new Date(stream.started_at).toLocaleTimeString() : 'Not started'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">AI Features</p>
                    <div className="flex space-x-2">
                      <Badge variant={stream.enable_ai_chat ? "default" : "secondary"}>
                        AI Chat {stream.enable_ai_chat ? 'ON' : 'OFF'}
                      </Badge>
                      <Badge variant={stream.ai_sales_mode ? "default" : "secondary"}>
                        Sales Mode {stream.ai_sales_mode ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}