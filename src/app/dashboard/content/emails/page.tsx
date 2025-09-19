"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Mail,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Send,
  Trash,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  BarChart3,
  FileText,
  Image,
  Link,
  Settings,
  Download,
  Target
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
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  type: 'welcome' | 'promotional' | 'reminder' | 'follow-up' | 'newsletter';
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  recipients: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  createdAt: Date;
  scheduledAt?: Date;
  sentAt?: Date;
  lastModified: Date;
  template: string;
  previewText: string;
}

interface EmailStats {
  totalCampaigns: number;
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
}

export default function EmailCampaignsPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'active'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setTimeout(() => {
        setStats({
          totalCampaigns: 28,
          totalSent: 145782,
          avgOpenRate: 24.6,
          avgClickRate: 3.8
        });

        setCampaigns([
          {
            id: '1',
            name: 'Event Reminder Campaign',
            subject: '🚀 Your webinar starts in 24 hours - Don\'t miss out!',
            type: 'reminder',
            status: 'sent',
            recipients: 12847,
            openRate: 28.4,
            clickRate: 4.2,
            unsubscribeRate: 0.3,
            createdAt: new Date('2024-02-13'),
            sentAt: new Date('2024-02-14T10:00:00'),
            lastModified: new Date('2024-02-13T15:30:00'),
            template: 'Event Reminder Pro',
            previewText: 'Get ready for tomorrow\'s exclusive marketing masterclass...'
          },
          {
            id: '2',
            name: 'Welcome Series - New Subscribers',
            subject: 'Welcome to ConvertCast! Here\'s what you need to know',
            type: 'welcome',
            status: 'active',
            recipients: 8934,
            openRate: 31.7,
            clickRate: 5.8,
            unsubscribeRate: 0.1,
            createdAt: new Date('2024-02-10'),
            lastModified: new Date('2024-02-15'),
            template: 'Welcome Series Modern',
            previewText: 'Thanks for joining us! Let\'s get you started with your first event...'
          },
          {
            id: '3',
            name: 'Post-Event Follow Up',
            subject: 'Thank you for attending! Here\'s your replay + bonus materials',
            type: 'follow-up',
            status: 'scheduled',
            recipients: 3421,
            openRate: 0,
            clickRate: 0,
            unsubscribeRate: 0,
            createdAt: new Date('2024-02-14'),
            scheduledAt: new Date('2024-02-16T09:00:00'),
            lastModified: new Date('2024-02-15T11:20:00'),
            template: 'Follow-up Professional',
            previewText: 'Access your exclusive replay and bonus materials from yesterday\'s session...'
          },
          {
            id: '4',
            name: 'Weekly Newsletter - February',
            subject: 'This week in webinars: AI, Marketing, and more 📧',
            type: 'newsletter',
            status: 'sent',
            recipients: 24567,
            openRate: 22.1,
            clickRate: 2.9,
            unsubscribeRate: 0.8,
            createdAt: new Date('2024-02-08'),
            sentAt: new Date('2024-02-12T08:00:00'),
            lastModified: new Date('2024-02-11T16:45:00'),
            template: 'Newsletter Weekly',
            previewText: 'Your weekly roundup of upcoming events and industry insights...'
          },
          {
            id: '5',
            name: 'Special Offer - Limited Time',
            subject: '🎯 50% OFF Premium Events - 48 hours only!',
            type: 'promotional',
            status: 'draft',
            recipients: 0,
            openRate: 0,
            clickRate: 0,
            unsubscribeRate: 0,
            createdAt: new Date('2024-02-15'),
            lastModified: new Date('2024-02-16T09:15:00'),
            template: 'Promotional Bold',
            previewText: 'Don\'t miss this exclusive limited-time offer for our premium events...'
          },
          {
            id: '6',
            name: 'Course Completion Congratulations',
            subject: '🎉 Congratulations! You\'ve completed the masterclass',
            type: 'follow-up',
            status: 'sent',
            recipients: 1876,
            openRate: 45.2,
            clickRate: 8.7,
            unsubscribeRate: 0.2,
            createdAt: new Date('2024-02-01'),
            sentAt: new Date('2024-02-05T14:00:00'),
            lastModified: new Date('2024-02-04T10:30:00'),
            template: 'Achievement Celebration',
            previewText: 'You did it! Here\'s your certificate and next steps...'
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
      draft: <Edit className="w-3 h-3 mr-1" />,
      scheduled: <Clock className="w-3 h-3 mr-1" />,
      sent: <CheckCircle className="w-3 h-3 mr-1" />,
      active: <Play className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center text-xs font-medium`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      welcome: 'bg-green-50 text-green-700 border-green-200',
      promotional: 'bg-orange-50 text-orange-700 border-orange-200',
      reminder: 'bg-blue-50 text-blue-700 border-blue-200',
      'follow-up': 'bg-purple-50 text-purple-700 border-purple-200',
      newsletter: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };

    return (
      <Badge variant="outline" className={`${variants[type as keyof typeof variants]} text-xs font-medium`}>
        {type.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  const statsData = stats ? [
    {
      title: 'Total Campaigns',
      value: stats.totalCampaigns,
      change: { value: '+4', trend: 'up' as const, period: 'this month' },
      icon: <Mail className="w-6 h-6" />,
      iconColor: 'text-blue-600',
      description: 'Email campaigns created'
    },
    {
      title: 'Emails Sent',
      value: stats.totalSent.toLocaleString(),
      change: { value: '+18.2%', trend: 'up' as const, period: 'vs last month' },
      icon: <Send className="w-6 h-6" />,
      iconColor: 'text-purple-600',
      description: 'Total email deliveries'
    },
    {
      title: 'Avg Open Rate',
      value: `${stats.avgOpenRate}%`,
      change: { value: '+1.4%', trend: 'up' as const, period: 'vs last month' },
      icon: <Eye className="w-6 h-6" />,
      iconColor: 'text-green-600',
      description: 'Email open performance'
    },
    {
      title: 'Avg Click Rate',
      value: `${stats.avgClickRate}%`,
      change: { value: '+0.3%', trend: 'up' as const, period: 'vs last month' },
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'text-indigo-600',
      description: 'Email click performance'
    }
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Campaigns"
        description="Create, manage, and analyze email marketing campaigns"
        icon={<Mail className="w-6 h-6 text-blue-600" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Email Campaign</DialogTitle>
                  <DialogDescription>
                    Start building your email campaign
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" />
                  </div>
                  <div>
                    <Label htmlFor="subject-line">Subject Line</Label>
                    <Input id="subject-line" placeholder="Enter email subject" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-type">Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Series</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="reminder">Event Reminder</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template-select">Email Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern-clean">Modern Clean</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="creative-bold">Creative Bold</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="preview-text">Preview Text</Label>
                    <Textarea
                      id="preview-text"
                      placeholder="Enter preview text that appears in email clients..."
                      rows={2}
                    />
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

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your email marketing campaigns and track performance</p>
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
                    [...Array(6)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
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
                            <p className="text-sm text-gray-500 mt-1 max-w-xs truncate">{campaign.subject}</p>
                            <p className="text-xs text-gray-400 mt-1">{campaign.template}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(campaign.type)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(campaign.status)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-900">
                            {campaign.recipients ? campaign.recipients.toLocaleString() : '0'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {campaign.status === 'sent' || campaign.status === 'active' ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Open:</span>
                                <span className="font-medium text-gray-900">{campaign.openRate}%</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Click:</span>
                                <span className="font-medium text-gray-900">{campaign.clickRate}%</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Unsub:</span>
                                <span className="font-medium text-gray-900">{campaign.unsubscribeRate}%</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            {campaign.sentAt && (
                              <>
                                <span className="text-gray-900">{campaign.sentAt.toLocaleDateString()}</span>
                                <p className="text-sm text-gray-500">Sent</p>
                              </>
                            )}
                            {campaign.scheduledAt && (
                              <>
                                <span className="text-gray-900">{campaign.scheduledAt.toLocaleDateString()}</span>
                                <p className="text-sm text-gray-500">Scheduled</p>
                              </>
                            )}
                            {!campaign.sentAt && !campaign.scheduledAt && (
                              <>
                                <span className="text-gray-900">{campaign.lastModified.toLocaleDateString()}</span>
                                <p className="text-sm text-gray-500">Modified</p>
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
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Send Test Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
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
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first email campaign to start engaging your audience.'}
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Email Automation Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set up automated email sequences based on user behavior and triggers.
                </p>
                <Button className="mt-4" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Automation
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Advanced Analytics Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get detailed insights into email performance, subscriber behavior, and campaign ROI.
                </p>
                <Button className="mt-4" disabled>
                  <Eye className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}