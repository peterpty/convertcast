'use client';

import React, { useState, useEffect, useRef } from 'react';
import { streamChatSystem, StreamChatMessage } from '@/lib/realtime/chat-system';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Users,
  MessageSquare,
  Send,
  Heart,
  ThumbsUp,
  Share2,
  Maximize,
  Volume2,
  VolumeX,
  Settings,
  ShoppingCart,
  ExternalLink,
  Clock,
  Star,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewerProps {
  streamId: string;
  initialViewerData?: {
    sessionId?: string;
    referralSource?: string;
    utmParams?: Record<string, string>;
  };
}

interface StreamInfo {
  id: string;
  title: string;
  description: string;
  status: 'live' | 'ended' | 'created';
  streamer_name: string;
  concurrent_viewers: number;
  started_at: string;
  enable_chat: boolean;
  enable_registration: boolean;
}

interface RegistrationForm {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
}

export function ViewerInterface({ streamId, initialViewerData }: ViewerProps) {
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [viewerId, setViewerId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<StreamChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);

  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initializeViewer();
    return () => {
      streamChatSystem.leaveStream();
    };
  }, [streamId]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeViewer = async () => {
    try {
      // Load stream info
      const { data: stream } = await supabase
        .from('live_streams')
        .select(`
          *,
          streamer:users(first_name, last_name)
        `)
        .eq('id', streamId)
        .single();

      if (!stream) {
        throw new Error('Stream not found');
      }

      setStreamInfo({
        ...stream,
        streamer_name: `${stream.streamer.first_name} ${stream.streamer.last_name}`,
      });

      // Create anonymous viewer record
      const { data: viewer } = await supabase
        .from('stream_viewers')
        .insert({
          stream_id: streamId,
          session_id: initialViewerData?.sessionId || crypto.randomUUID(),
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
          referrer_url: document.referrer,
          device_type: getDeviceType(),
          browser: getBrowser(),
          country: await getCountry(),
        })
        .select()
        .single();

      if (viewer) {
        setViewerId(viewer.id);
        await connectToStream(viewer.id);
      }
    } catch (error) {
      console.error('Error initializing viewer:', error);
    }
  };

  const connectToStream = async (viewerId: string) => {
    try {
      await streamChatSystem.joinStream(streamId, viewerId, false);

      // Subscribe to chat messages
      streamChatSystem.onMessage((message) => {
        setChatMessages(prev => [...prev, message]);
      });

      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to stream:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !isConnected) return;

    try {
      await streamChatSystem.sendMessage(chatMessage);
      setChatMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const submitRegistration = async () => {
    if (!registrationForm.email || !registrationForm.firstName) return;

    setIsSubmittingRegistration(true);

    try {
      const { error } = await supabase
        .from('stream_registrations')
        .insert({
          stream_id: streamId,
          viewer_id: viewerId,
          email: registrationForm.email,
          first_name: registrationForm.firstName,
          last_name: registrationForm.lastName,
          phone: registrationForm.phone,
          company: registrationForm.company,
          registration_source: 'live_stream',
          utm_source: initialViewerData?.utmParams?.utm_source,
          utm_medium: initialViewerData?.utmParams?.utm_medium,
          utm_campaign: initialViewerData?.utmParams?.utm_campaign,
          attended_stream: true,
          attended_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update viewer record with contact info
      await supabase
        .from('stream_viewers')
        .update({
          email: registrationForm.email,
          first_name: registrationForm.firstName,
          last_name: registrationForm.lastName,
          phone: registrationForm.phone,
        })
        .eq('id', viewerId);

      setIsRegistered(true);
      setShowRegistration(false);
    } catch (error) {
      console.error('Error submitting registration:', error);
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const sendReaction = async (reaction: string) => {
    if (!isConnected) return;

    try {
      await streamChatSystem.sendMessage(reaction, 'emoji');
      setShowReactions(false);
    } catch (error) {
      console.error('Error sending reaction:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatViewerCount = (count: number) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const getDeviceType = (): string => {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  };

  const getBrowser = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '';
    }
  };

  const getCountry = async (): Promise<string> => {
    try {
      const response = await fetch('https://ipapi.co/country/');
      return await response.text();
    } catch {
      return '';
    }
  };

  if (!streamInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading stream...</p>
        </div>
      </div>
    );
  }

  if (streamInfo.status !== 'live') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Stream Not Available</h1>
          <p className="text-gray-400">This stream has ended or is not currently live.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls={false}
          autoPlay
          muted={isMuted}
        >
          <source src={streamInfo.stream_url || '/api/placeholder-stream'} type="application/x-mpegURL" />
        </video>

        {/* Player Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                <Play className="w-5 h-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">LIVE</span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  {formatViewerCount(streamInfo.concurrent_viewers)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Reactions */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowReactions(!showReactions)}
                  className="text-white hover:bg-white/20"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                {showReactions && (
                  <div className="absolute bottom-full right-0 mb-2 flex space-x-2 bg-black/80 rounded-lg p-2">
                    {['❤️', '👍', '👏', '🔥', '😂', '😮'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => sendReaction(emoji)}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stream Info Overlay */}
        <div className="absolute top-4 left-4 bg-black/60 rounded-lg p-3">
          <h2 className="font-bold text-lg">{streamInfo.title}</h2>
          <p className="text-sm text-gray-300">with {streamInfo.streamer_name}</p>
          <div className="flex items-center mt-2 text-xs text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            Started {new Date(streamInfo.started_at).toLocaleTimeString()}
          </div>
        </div>

        {/* Registration CTA */}
        {!isRegistered && streamInfo.enable_registration && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 max-w-sm">
            <h3 className="font-bold mb-2">Don't miss out!</h3>
            <p className="text-sm mb-3">Register to get exclusive updates and offers.</p>
            <Button
              size="sm"
              onClick={() => setShowRegistration(true)}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Register Now
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="bg-slate-900 border-t border-slate-700">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-slate-700 rounded-none h-12">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>About</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                {/* Chat Messages */}
                <div
                  ref={chatMessagesRef}
                  className="h-80 overflow-y-auto p-4 space-y-3"
                >
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {message.viewer_name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">
                            {message.viewer_name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(message.sent_at).toLocaleTimeString()}
                          </span>
                          {message.message_type === 'streamer_response' && (
                            <Badge className="bg-purple-600 text-white text-xs">Host</Badge>
                          )}
                        </div>
                        <p className="text-gray-300">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                {streamInfo.enable_chat && (
                  <div className="border-t border-slate-700 p-4">
                    <div className="flex space-x-3">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-1 bg-slate-700 border-slate-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        disabled={!isConnected}
                      />
                      <Button
                        onClick={sendChatMessage}
                        disabled={!chatMessage.trim() || !isConnected}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="p-4">
            <div className="max-w-2xl mx-auto">
              <Card className="p-6 bg-slate-800 border-slate-700">
                <h3 className="text-xl font-bold mb-4">{streamInfo.title}</h3>
                <p className="text-gray-300 mb-4">{streamInfo.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Host:</span>
                    <p className="font-medium">{streamInfo.streamer_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Started:</span>
                    <p className="font-medium">{new Date(streamInfo.started_at).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Register for Updates</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First Name"
                    value={registrationForm.firstName}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    placeholder="Last Name"
                    value={registrationForm.lastName}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                />
                <Input
                  placeholder="Phone (Optional)"
                  value={registrationForm.phone}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                />
                <Input
                  placeholder="Company (Optional)"
                  value={registrationForm.company}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={submitRegistration}
                  disabled={!registrationForm.email || !registrationForm.firstName || isSubmittingRegistration}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isSubmittingRegistration ? 'Registering...' : 'Register'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}