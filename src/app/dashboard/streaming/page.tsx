'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Search,
  Plus,
  Video,
  Radio,
  Eye,
  Copy,
  MoreHorizontal,
  Activity,
  Users,
  Clock,
  Settings,
  ExternalLink,
  Play,
  Square,
  Pause
} from 'lucide-react';

interface Stream {
  id: string;
  title: string;
  description: string;
  status: 'idle' | 'active' | 'disconnected';
  mux_stream_id: string;
  stream_key: string;
  playback_url: string;
  is_private: boolean;
  created_at: string;
  events?: {
    id: string;
    title: string;
    status: string;
  };
}

export default function StreamingPage() {
  const { user } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadStreams();
    }
  }, [user]);

  const loadStreams = async () => {
    try {
      const response = await fetch(`/api/streams?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setStreams(data.streams || []);
      }
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStreams = streams.filter(stream =>
    stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stream.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'idle': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'disconnected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const copyStreamKey = (streamKey: string) => {
    navigator.clipboard.writeText(streamKey);
    // You could add a toast notification here
    alert('Stream key copied to clipboard!');
  };

  const copyPlaybackUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Playback URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Radio className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Streaming</h1>
              <p className="text-gray-600 mt-1">Manage your live streams and broadcasts</p>
            </div>
          </div>
        </div>
        <Link href="/dashboard/streaming/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Stream
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search streams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Now</p>
              <p className="text-2xl font-bold text-gray-900">
                {streams.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Streams</p>
              <p className="text-2xl font-bold text-gray-900">{streams.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Viewers</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Watch Time</p>
              <p className="text-2xl font-bold text-gray-900">0h</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Streams List */}
      {filteredStreams.length === 0 ? (
        <Card className="p-12 text-center">
          <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {streams.length === 0 ? 'No streams yet' : 'No streams match your search'}
          </h3>
          <p className="text-gray-600 mb-6">
            {streams.length === 0
              ? 'Create your first live stream to start broadcasting'
              : 'Try adjusting your search terms'
            }
          </p>
          {streams.length === 0 && (
            <Link href="/dashboard/streaming/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Stream
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredStreams.map((stream) => (
            <Card key={stream.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{stream.title}</h3>
                    <Badge className={`text-xs ${getStatusColor(stream.status)}`}>
                      {stream.status === 'active' && <Activity className="w-3 h-3 mr-1" />}
                      {stream.status.charAt(0).toUpperCase() + stream.status.slice(1)}
                    </Badge>
                    {stream.is_private && (
                      <Badge variant="outline" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{stream.description}</p>

                  <div className="flex items-center text-sm text-gray-500 space-x-6">
                    {stream.events && (
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-1" />
                        Event: {stream.events.title}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Created {new Date(stream.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyStreamKey(stream.stream_key)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Stream Key
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyPlaybackUrl(stream.playback_url)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Playback URL
                  </Button>

                  {stream.status === 'active' ? (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Square className="w-4 h-4 mr-1" />
                      Stop Stream
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-1" />
                      Go Live
                    </Button>
                  )}

                  <Link href={`/dashboard/streaming/${stream.id}`}>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}