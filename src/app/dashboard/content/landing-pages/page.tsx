"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Globe,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Share,
  Trash,
  ExternalLink,
  TrendingUp,
  Users,
  MousePointer,
  Clock,
  Zap,
  Settings,
  BarChart3,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Download
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
import { Progress } from '@/components/ui/progress';

interface LandingPage {
  id: string;
  name: string;
  url: string;
  eventTitle: string;
  template: string;
  status: 'live' | 'draft' | 'paused';
  views: number;
  conversionRate: number;
  registrations: number;
  createdAt: Date;
  lastModified: Date;
  publishedAt?: Date;
  mobileOptimized: boolean;
  seoScore: number;
}

interface LandingPageStats {
  totalPages: number;
  totalViews: number;
  avgConversionRate: number;
  totalRegistrations: number;
}

export default function LandingPagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft' | 'paused'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LandingPageStats | null>(null);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isNewPageOpen, setIsNewPageOpen] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setTimeout(() => {
        setStats({
          totalPages: 14,
          totalViews: 89247,
          avgConversionRate: 18.6,
          totalRegistrations: 16602
        });

        setLandingPages([
          {
            id: '1',
            name: 'Marketing Masterclass 2024',
            url: 'https://convertcast.com/events/marketing-masterclass-2024',
            eventTitle: 'Digital Marketing Masterclass 2024',
            template: 'Modern Hero',
            status: 'live',
            views: 15847,
            conversionRate: 28.4,
            registrations: 4500,
            createdAt: new Date('2024-01-10'),
            lastModified: new Date('2024-02-14'),
            publishedAt: new Date('2024-01-15'),
            mobileOptimized: true,
            seoScore: 92
          },
          {
            id: '2',
            name: 'AI Revolution Business',
            url: 'https://convertcast.com/events/ai-revolution-business',
            eventTitle: 'AI Revolution in Business',
            template: 'Tech Focused',
            status: 'live',
            views: 12395,
            conversionRate: 31.2,
            registrations: 3867,
            createdAt: new Date('2024-01-08'),
            lastModified: new Date('2024-02-13'),
            publishedAt: new Date('2024-01-10'),
            mobileOptimized: true,
            seoScore: 89
          },
          {
            id: '3',
            name: 'E-commerce Growth',
            url: 'https://convertcast.com/events/ecommerce-growth',
            eventTitle: 'E-commerce Growth Strategies',
            template: 'Business Pro',
            status: 'paused',
            views: 18762,
            conversionRate: 22.1,
            registrations: 4145,
            createdAt: new Date('2024-01-05'),
            lastModified: new Date('2024-02-10'),
            publishedAt: new Date('2024-01-08'),
            mobileOptimized: true,
            seoScore: 85
          },
          {
            id: '4',
            name: 'Crypto Trading 101',
            url: '',
            eventTitle: 'Crypto Trading Fundamentals',
            template: 'Finance Focus',
            status: 'draft',
            views: 0,
            conversionRate: 0,
            registrations: 0,
            createdAt: new Date('2024-02-01'),
            lastModified: new Date('2024-02-15'),
            mobileOptimized: false,
            seoScore: 0
          },
          {
            id: '5',
            name: 'Personal Branding',
            url: 'https://convertcast.com/events/personal-branding-workshop',
            eventTitle: 'Personal Branding Workshop',
            template: 'Creative Style',
            status: 'live',
            views: 8934,
            conversionRate: 19.8,
            registrations: 1769,
            createdAt: new Date('2024-01-12'),
            lastModified: new Date('2024-02-11'),
            publishedAt: new Date('2024-01-15'),
            mobileOptimized: true,
            seoScore: 88
          },
          {
            id: '6',
            name: 'Investment Portfolio',
            url: 'https://convertcast.com/events/investment-portfolio',
            eventTitle: 'Investment Portfolio Optimization',
            template: 'Wealth Builder',
            status: 'live',
            views: 6742,
            conversionRate: 15.3,
            registrations: 1031,
            createdAt: new Date('2024-01-15'),
            lastModified: new Date('2024-02-12'),
            publishedAt: new Date('2024-01-18'),
            mobileOptimized: true,
            seoScore: 91
          }
        ]);

        setLoading(false);
      }, 1200);
    };

    loadData();
  }, []);

  const filteredPages = landingPages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      live: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const icons = {
      live: <CheckCircle className="w-3 h-3 mr-1" />,
      draft: <Edit className="w-3 h-3 mr-1" />,
      paused: <Pause className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center text-xs font-medium`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const statsData = stats ? [
    {
      title: 'Total Pages',
      value: stats.totalPages,
      change: { value: '+3', trend: 'up' as const, period: 'this month' },
      icon: <Globe className="w-6 h-6" />,
      iconColor: 'text-blue-600',
      description: 'Landing pages created'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: { value: '+23.4%', trend: 'up' as const, period: 'vs last month' },
      icon: <Eye className="w-6 h-6" />,
      iconColor: 'text-purple-600',
      description: 'Page visits'
    },
    {
      title: 'Avg Conversion Rate',
      value: `${stats.avgConversionRate}%`,
      change: { value: '+2.8%', trend: 'up' as const, period: 'vs last month' },
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'text-green-600',
      description: 'Visitors to registrations'
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations.toLocaleString(),
      change: { value: '+1,247', trend: 'up' as const, period: 'this month' },
      icon: <Users className="w-6 h-6" />,
      iconColor: 'text-indigo-600',
      description: 'From all pages'
    }
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing Pages"
        description="Create and manage high-converting landing pages for your events"
        icon={<Globe className="w-6 h-6 text-blue-600" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Layout className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Dialog open={isNewPageOpen} onOpenChange={setIsNewPageOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Page
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Landing Page</DialogTitle>
                  <DialogDescription>
                    Start with a template or build from scratch
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="page-name">Page Name</Label>
                    <Input id="page-name" placeholder="Enter page name" />
                  </div>
                  <div>
                    <Label htmlFor="event-select">Select Event</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing-masterclass">Marketing Masterclass 2024</SelectItem>
                        <SelectItem value="ai-revolution">AI Revolution in Business</SelectItem>
                        <SelectItem value="ecommerce-growth">E-commerce Growth Strategies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template-select">Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern-hero">Modern Hero</SelectItem>
                        <SelectItem value="business-pro">Business Pro</SelectItem>
                        <SelectItem value="tech-focused">Tech Focused</SelectItem>
                        <SelectItem value="creative-style">Creative Style</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewPageOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create Page</Button>
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

      {/* Landing Pages Table */}
      <Card className="border-0 shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Landing Pages</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your event registration pages and track performance</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search pages..."
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
                  <DropdownMenuItem onClick={() => setStatusFilter('live')}>Live</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('draft')}>Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('paused')}>Paused</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-medium">Page</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Performance</TableHead>
                <TableHead className="font-medium">SEO Score</TableHead>
                <TableHead className="font-medium">Mobile</TableHead>
                <TableHead className="font-medium">Last Modified</TableHead>
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
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
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
                filteredPages.map((page) => (
                  <TableRow key={page.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{page.name}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{page.eventTitle}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {page.template}
                          </Badge>
                          {page.url && (
                            <a
                              href={page.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Page
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(page.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Views:</span>
                          <span className="font-medium text-gray-900">{page.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Conv Rate:</span>
                          <span className="font-medium text-gray-900">{page.conversionRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Registrations:</span>
                          <span className="font-medium text-gray-900">{page.registrations.toLocaleString()}</span>
                        </div>
                        {page.status !== 'draft' && (
                          <Progress
                            value={page.conversionRate}
                            className="h-1 mt-2"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {page.seoScore > 0 ? (
                        <div className="flex items-center">
                          <span className={`font-medium ${getSEOScoreColor(page.seoScore)}`}>
                            {page.seoScore}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">/100</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {page.mobileOptimized ? (
                          <>
                            <Smartphone className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-sm text-green-600">Optimized</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">Not optimized</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-gray-900">{page.lastModified.toLocaleDateString()}</span>
                        <p className="text-sm text-gray-500">
                          {Math.floor((new Date().getTime() - page.lastModified.getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </p>
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
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Page
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            SEO Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {page.status === 'live' ? (
                            <DropdownMenuItem>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause Page
                            </DropdownMenuItem>
                          ) : page.status === 'paused' ? (
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              Go Live
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Page
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

        {!loading && filteredPages.length === 0 && (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No landing pages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first landing page to start converting visitors into event registrants.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}