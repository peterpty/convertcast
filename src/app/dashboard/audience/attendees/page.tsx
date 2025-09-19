'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  UserPlus,
  UserCheck,
  Clock,
  Star,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  registeredAt: string;
  lastActive: string;
  eventsAttended: number;
  totalWatchTime: number; // minutes
  status: 'active' | 'inactive' | 'blocked';
  source: 'direct' | 'social' | 'email' | 'referral';
  tags: string[];
  avatar?: string;
}

export default function AttendeesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  // Sample data - in production, this would come from your database
  const [attendees] = useState<Attendee[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      registeredAt: '2024-01-15T10:30:00Z',
      lastActive: '2024-01-20T16:45:00Z',
      eventsAttended: 12,
      totalWatchTime: 1847,
      status: 'active',
      source: 'email',
      tags: ['VIP', 'High Engagement'],
      avatar: '/avatars/sarah.jpg'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      location: 'San Francisco, CA',
      registeredAt: '2024-01-12T14:20:00Z',
      lastActive: '2024-01-19T09:15:00Z',
      eventsAttended: 8,
      totalWatchTime: 1124,
      status: 'active',
      source: 'social',
      tags: ['Regular Attendee'],
      avatar: '/avatars/michael.jpg'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+1 (555) 987-6543',
      location: 'Austin, TX',
      registeredAt: '2024-01-10T08:45:00Z',
      lastActive: '2024-01-18T12:30:00Z',
      eventsAttended: 15,
      totalWatchTime: 2156,
      status: 'active',
      source: 'direct',
      tags: ['Super Fan', 'Early Adopter'],
      avatar: '/avatars/emily.jpg'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@example.com',
      location: 'Seattle, WA',
      registeredAt: '2024-01-08T19:00:00Z',
      lastActive: '2024-01-10T11:20:00Z',
      eventsAttended: 3,
      totalWatchTime: 287,
      status: 'inactive',
      source: 'referral',
      tags: ['New Member'],
      avatar: '/avatars/david.jpg'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      registeredAt: '2024-01-05T13:15:00Z',
      lastActive: '2024-01-20T20:45:00Z',
      eventsAttended: 18,
      totalWatchTime: 2943,
      status: 'active',
      source: 'email',
      tags: ['VIP', 'Ambassador'],
      avatar: '/avatars/lisa.jpg'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attendee.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || attendee.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const toggleAttendeeSelection = (attendeeId: string) => {
    setSelectedAttendees(prev =>
      prev.includes(attendeeId)
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const selectAllAttendees = () => {
    setSelectedAttendees(
      selectedAttendees.length === filteredAttendees.length
        ? []
        : filteredAttendees.map(a => a.id)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'email':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'social':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'direct':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'referral':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = [
    {
      title: 'Total Attendees',
      value: attendees.length.toLocaleString(),
      change: { value: '+12.5%', trend: 'up' as const, period: 'this month' },
      icon: <Users className="w-6 h-6" />,
      iconColor: 'text-purple-600'
    },
    {
      title: 'Active Members',
      value: attendees.filter(a => a.status === 'active').length,
      change: { value: '+8.2%', trend: 'up' as const, period: 'this month' },
      icon: <UserCheck className="w-6 h-6" />,
      iconColor: 'text-green-600'
    },
    {
      title: 'Avg Watch Time',
      value: `${Math.floor(attendees.reduce((sum, a) => sum + a.totalWatchTime, 0) / attendees.length / 60)}h`,
      change: { value: '+15.3%', trend: 'up' as const, period: 'this month' },
      icon: <Clock className="w-6 h-6" />,
      iconColor: 'text-blue-600'
    },
    {
      title: 'Top Performers',
      value: attendees.filter(a => a.tags.includes('VIP')).length,
      change: { value: '+2', trend: 'up' as const, period: 'this month' },
      icon: <Star className="w-6 h-6" />,
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Attendees"
        description="Manage your event attendees and audience members"
        icon={<Users className="w-6 h-6 text-purple-600" />}
        badge={{ text: `${attendees.length} Total`, variant: 'default' }}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Attendee
            </Button>
          </div>
        }
        gradient
      />

      {/* Stats */}
      <div className="mb-8">
        <StatsGrid stats={stats} columns={4} loading={loading} />
      </div>

      {/* Filters & Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search attendees by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Sources</option>
              <option value="email">Email</option>
              <option value="social">Social Media</option>
              <option value="direct">Direct</option>
              <option value="referral">Referral</option>
            </select>
          </div>
        </div>

        {selectedAttendees.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-800">
                {selectedAttendees.length} attendee{selectedAttendees.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4 mr-1" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Send Message
                </Button>
                <Button size="sm" variant="outline">
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Attendees Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.length === filteredAttendees.length}
                    onChange={selectAllAttendees}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Attendee</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Contact</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Activity</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Engagement</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Source</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="w-16 py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr
                  key={attendee.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.includes(attendee.id)}
                      onChange={() => toggleAttendeeSelection(attendee.id)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{attendee.name}</div>
                        <div className="text-sm text-gray-500">{attendee.location}</div>
                        {attendee.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {attendee.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                className="text-xs bg-purple-100 text-purple-800"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-2" />
                        {attendee.email}
                      </div>
                      {attendee.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-2" />
                          {attendee.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-3 h-3 mr-2" />
                        Joined {format(new Date(attendee.registeredAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-3 h-3 mr-2" />
                        Last active {format(new Date(attendee.lastActive), 'MMM dd')}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-gray-900">
                        {attendee.eventsAttended} events
                      </div>
                      <div className="text-gray-600">
                        {Math.floor(attendee.totalWatchTime / 60)}h {attendee.totalWatchTime % 60}m watch time
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={`text-xs ${getSourceBadgeColor(attendee.source)}`}>
                      {attendee.source}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {getStatusIcon(attendee.status)}
                      <span className="ml-2 text-sm capitalize">{attendee.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendees.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {attendees.length === 0 ? 'No attendees yet' : 'No attendees match your search'}
            </h3>
            <p className="text-gray-600 mb-6">
              {attendees.length === 0
                ? 'Start hosting events to build your audience'
                : 'Try adjusting your search or filters'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}