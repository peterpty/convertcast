'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Search,
  Calendar,
  Users,
  Edit,
  Trash2,
  Play,
  MoreHorizontal,
  Video,
  Activity
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
  max_attendees?: number;
  created_at: string;
}

export default function LiveEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadLiveEvents();
    }
  }, [user]);

  const loadLiveEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('streamer_id', user?.id)
        .eq('status', 'live')
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading live events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const endEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to end this live event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'ended' })
        .eq('id', eventId);

      if (error) throw error;
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Error ending event:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
            <div className="p-2 bg-red-100 rounded-lg">
              <Video className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Events</h1>
              <p className="text-gray-600 mt-1">Events currently broadcasting</p>
            </div>
          </div>
        </div>
        <Link href="/dashboard/events/new">
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Start New Event
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search live events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Now</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Viewers</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {events.length === 0 ? 'No live events' : 'No events match your search'}
          </h3>
          <p className="text-gray-600 mb-6">
            {events.length === 0
              ? 'You don\'t have any events broadcasting right now'
              : 'Try adjusting your search terms'
            }
          </p>
          {events.length === 0 && (
            <Link href="/dashboard/events/new">
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Start Your First Live Event
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-600 font-medium text-sm">LIVE</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Started {formatDate(event.scheduled_at)}
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Max {event.max_attendees} attendees
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-800">
                    <Video className="w-4 h-4 mr-1" />
                    Manage Stream
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => endEvent(event.id)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    End Event
                  </Button>
                  <Link href={`/dashboard/events/${event.id}`}>
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