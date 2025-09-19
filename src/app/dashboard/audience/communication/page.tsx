"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Send,
  Mail,
  Bell,
  Users,
  TrendingUp,
  Clock,
  Eye,
  MessageCircle,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Bookmark
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  subject: string;
  audience: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  scheduledDate?: Date;
  sentDate?: Date;
  createdAt: Date;
}

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  category: string;
  thumbnail: string;
  usage: number;
  isPopular: boolean;
}

interface CommunicationStats {
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  activeSubscribers: number;
}

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'active'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setTimeout(() => {
        setStats({
          totalSent: 45672,
          avgOpenRate: 24.8,
          avgClickRate: 3.7,
          activeSubscribers: 12847
        });

        setCampaigns([
          {
            id: '1',
            name: 'Event Reminder - Marketing Masterclass',
            type: 'email',
            status: 'sent',
            subject: '🚀 Your webinar starts in 24 hours!',
            audience: 'Event Registrants',
            recipients: 2847,
            openRate: 28.4,
            clickRate: 4.2,
            sentDate: new Date('2024-02-14T10:00:00'),
            createdAt: new Date('2024-02-13')
          },
          {
            id: '2',
            name: 'Welcome Series - New Subscribers',
            type: 'email',
            status: 'active',
            subject: 'Welcome to ConvertCast! Here\'s what\'s next...',
            audience: 'New Subscribers',
            recipients: 1923,
            openRate: 31.7,
            clickRate: 5.8,
            createdAt: new Date('2024-02-10')
          },
          {
            id: '3',
            name: 'Post-Event Follow-up',
            type: 'email',
            status: 'scheduled',
            subject: 'Thank you for attending! Here\'s your replay link',
            audience: 'Event Attendees',
            recipients: 3421,
            openRate: 0,
            clickRate: 0,
            scheduledDate: new Date('2024-02-16T09:00:00'),
            createdAt: new Date('2024-02-14')
          },
          {
            id: '4',
            name: 'SMS Reminder - Live in 1 hour',
            type: 'sms',
            status: 'sent',
            subject: 'ConvertCast LIVE: Your event starts in 1 hour! Join now: convertcast.com/live/abc123',
            audience: 'High-Value Registrants',
            recipients: 856,
            openRate: 95.2,
            clickRate: 12.4,
            sentDate: new Date('2024-02-15T18:00:00'),
            createdAt: new Date('2024-02-15')
          },
          {
            id: '5',
            name: 'Push Notification - New Event Available',
            type: 'push',
            status: 'draft',
            subject: '🎯 New masterclass just announced!',
            audience: 'App Users',
            recipients: 0,
            openRate: 0,
            clickRate: 0,
            createdAt: new Date('2024-02-16')
          }
        ]);

        setTemplates([
          {
            id: '1',
            name: 'Event Reminder Email',
            type: 'email',
            category: 'Event Marketing',
            thumbnail: '/templates/event-reminder.jpg',
            usage: 1243,
            isPopular: true
          },
          {
            id: '2',
            name: 'Welcome Email Series',
            type: 'email',
            category: 'Onboarding',
            thumbnail: '/templates/welcome-series.jpg',
            usage: 987,
            isPopular: true
          },
          {
            id: '3',
            name: 'Post-Event Thank You',
            type: 'email',
            category: 'Follow-up',
            thumbnail: '/templates/thank-you.jpg',
            usage: 756,
            isPopular: false
          },
          {
            id: '4',
            name: 'SMS Event Alert',
            type: 'sms',
            category: 'Notifications',
            thumbnail: '/templates/sms-alert.jpg',
            usage: 445,
            isPopular: false
          }
        ]);

        setLoading(false);
      }, 1200);
    };

    loadData();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      sent: 'bg-green-100 text-green-800 border-green-200',
      active: 'bg-purple-100 text-purple-800 border-purple-200'
    };

    const icons = {
      draft: <AlertTriangle className="w-3 h-3 mr-1" />,
      scheduled: <Clock className="w-3 h-3 mr-1" />,
      sent: <CheckCircle className="w-3 h-3 mr-1" />,
      active: <Zap className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center text-xs font-medium`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      push: <Bell className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <MessageCircle className="w-4 h-4" />;
  };

  const statsData = stats ? [
    {
      title: 'Messages Sent',
      value: stats.totalSent.toLocaleString(),
      change: { value: '+15.2%', trend: 'up' as const, period: 'vs last month' },
      icon: <Send className="w-6 h-6" />,
      iconColor: 'text-blue-600',
      description: 'Across all channels'
    },
    {
      title: 'Average Open Rate',
      value: `${stats.avgOpenRate}%`,
      change: { value: '+2.1%', trend: 'up' as const, period: 'vs last month' },
      icon: <Eye className="w-6 h-6" />,
      iconColor: 'text-green-600',
      description: 'Email campaigns'
    },
    {
      title: 'Average Click Rate',
      value: `${stats.avgClickRate}%`,
      change: { value: '+0.8%', trend: 'up' as const, period: 'vs last month' },
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'text-purple-600',
      description: 'All message types'
    },
    {
      title: 'Active Subscribers',
      value: stats.activeSubscribers.toLocaleString(),
      change: { value: '+347', trend: 'up' as const, period: 'this week' },
      icon: <Users className="w-6 h-6" />,
      iconColor: 'text-indigo-600',
      description: 'Opted-in contacts'
    }
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication Center"
        description="Create and manage email campaigns, SMS messages, and push notifications"
        icon={<MessageSquare className="w-6 h-6 text-purple-600" />}
        badge={{ text: "NEW", variant: "default" }}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Audience Builder
            </Button>
            <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Choose your campaign type to get started
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-type">Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Campaign</SelectItem>
                        <SelectItem value="sms">SMS Campaign</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subscribers</SelectItem>
                        <SelectItem value="event-registrants">Event Registrants</SelectItem>
                        <SelectItem value="new-users">New Users</SelectItem>
                        <SelectItem value="high-value">High-Value Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewCampaignOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create Campaign</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
        gradient
      />

      {/* Stats Grid */}
      <StatsGrid stats={statsData} loading={loading} />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Campaign Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Create, schedule, and monitor your communication campaigns</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('draft')}>Draft</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('scheduled')}>Scheduled</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('sent')}>Sent</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-medium">Campaign</TableHead>
                    <TableHead className="font-medium">Type</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Recipients</TableHead>
                    <TableHead className="font-medium">Performance</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="animate-pulse">
                            <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse ml-auto"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{campaign.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-gray-100 mr-3">
                              {getTypeIcon(campaign.type)}
                            </div>
                            <span className="capitalize font-medium text-gray-900">{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(campaign.status)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium text-gray-900">{campaign.recipients.toLocaleString()}</span>
                            <p className="text-sm text-gray-500">{campaign.audience}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {campaign.status === 'sent' || campaign.status === 'active' ? (
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Eye className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="text-gray-600">{campaign.openRate}%</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <TrendingUp className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="text-gray-600">{campaign.clickRate}%</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            {campaign.sentDate && (
                              <>
                                <span className="text-gray-900">{campaign.sentDate.toLocaleDateString()}</span>
                                <p className="text-sm text-gray-500">Sent</p>
                              </>
                            )}
                            {campaign.scheduledDate && (
                              <>
                                <span className="text-gray-900">{campaign.scheduledDate.toLocaleDateString()}</span>
                                <p className="text-sm text-gray-500">Scheduled</p>
                              </>
                            )}
                            {!campaign.sentDate && !campaign.scheduledDate && (
                              <>
                                <span className="text-gray-900">{campaign.createdAt.toLocaleDateString()}</span>
                                <p className="text-sm text-gray-500">Created</p>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first communication campaign.'}
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Message Templates</h3>
                  <p className="text-sm text-gray-600 mt-1">Pre-built templates to jumpstart your campaigns</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          {getTypeIcon(template.type)}
                          <span className="ml-2 text-sm font-medium text-gray-600 capitalize">{template.type}</span>
                        </div>
                        {template.isPopular && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{template.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{template.usage} uses</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Bookmark className="w-3 h-3" />
                          </Button>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="text-center py-12">
                <Zap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Automation Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set up automated email sequences and triggers to engage your audience at the perfect time.
                </p>
                <Button className="mt-4" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Automation
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}