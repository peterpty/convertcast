'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Edit,
  Play,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration: number;
  timezone: string;
  status: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
  max_attendees?: number;
  registration_required: boolean;
  created_at: string;
}

export default function EventDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && user) {
      loadEvent();
    }
  }, [params.id, user]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .eq('streamer_id', user?.id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error loading event:', error);
      router.push('/dashboard/events');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/dashboard/events');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-red-600 bg-red-100 border-red-200';
      case 'scheduled': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'ended': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'draft': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const copyEventLink = () => {
    const eventUrl = `${window.location.origin}/event/${event?.id}`;
    navigator.clipboard.writeText(eventUrl);
    alert('Event link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Link href="/dashboard/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <p className="text-gray-600">Event Details & Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {event.status === 'scheduled' && (
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          )}
          <Link href={`/dashboard/events/${event.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" onClick={deleteEvent} className="text-red-600 hover:text-red-800">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </Card>

          {/* Event Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Duration</h3>
                <p className="text-gray-600">{event.duration} minutes</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Timezone</h3>
                <p className="text-gray-600">{event.timezone}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Max Attendees</h3>
                <p className="text-gray-600">
                  {event.max_attendees ? event.max_attendees.toLocaleString() : 'Unlimited'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Registration</h3>
                <p className="text-gray-600">
                  {event.registration_required ? 'Required' : 'Open access'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{formatDate(event.scheduled_at)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{event.duration} minutes</span>
              </div>
              {event.max_attendees && (
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">Max {event.max_attendees} attendees</span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={copyEventLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Event Link
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Landing Page
              </Button>
              <Link href={`/dashboard/events/${event.id}/participants`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Participants
                </Button>
              </Link>
            </div>
          </Card>

          {/* Event Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Registered</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Views</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue</span>
                <span className="font-semibold">$0</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}