"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Target,
  TrendingUp,
  Filter,
  Plus,
  Crown,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Share,
  Trash,
  Calendar,
  MapPin,
  Activity,
  DollarSign,
  Mail,
  Clock,
  UserCheck,
  Zap,
  BarChart3,
  Settings,
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

interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    type: 'behavioral' | 'demographic' | 'engagement' | 'custom';
    rules: string[];
  };
  audienceSize: number;
  growthRate: number;
  lastUpdated: Date;
  isActive: boolean;
  conversionRate: number;
  avgRevenue: number;
  topEvents: string[];
  createdAt: Date;
}

interface SegmentStats {
  totalSegments: number;
  totalAudience: number;
  avgConversion: number;
  avgRevenue: number;
}

export default function SegmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'behavioral' | 'demographic' | 'engagement' | 'custom'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SegmentStats | null>(null);
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [isNewSegmentOpen, setIsNewSegmentOpen] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setTimeout(() => {
        setStats({
          totalSegments: 12,
          totalAudience: 47892,
          avgConversion: 18.4,
          avgRevenue: 247.50
        });

        setSegments([
          {
            id: '1',
            name: 'High-Value Customers',
            description: 'Users who have purchased premium events and have high engagement rates',
            criteria: {
              type: 'behavioral',
              rules: ['Purchase value > $500', 'Event attendance > 80%', 'Email engagement > 40%']
            },
            audienceSize: 3247,
            growthRate: 12.5,
            lastUpdated: new Date('2024-02-15'),
            isActive: true,
            conversionRate: 34.2,
            avgRevenue: 892.50,
            topEvents: ['Marketing Masterclass', 'AI Revolution'],
            createdAt: new Date('2024-01-10')
          },
          {
            id: '2',
            name: 'New User Onboarding',
            description: 'Recently registered users within the first 30 days',
            criteria: {
              type: 'demographic',
              rules: ['Registration date < 30 days', 'Events attended = 0', 'Profile completion < 70%']
            },
            audienceSize: 8934,
            growthRate: 45.7,
            lastUpdated: new Date('2024-02-16'),
            isActive: true,
            conversionRate: 8.9,
            avgRevenue: 47.20,
            topEvents: ['Welcome Webinar', 'Platform Tour'],
            createdAt: new Date('2024-01-05')
          },
          {
            id: '3',
            name: 'Enterprise Decision Makers',
            description: 'C-level executives and decision makers from enterprise companies',
            criteria: {
              type: 'demographic',
              rules: ['Job title contains "CEO|CTO|VP"', 'Company size > 500', 'Industry = Technology']
            },
            audienceSize: 1876,
            growthRate: 8.3,
            lastUpdated: new Date('2024-02-14'),
            isActive: true,
            conversionRate: 28.6,
            avgRevenue: 1247.80,
            topEvents: ['Enterprise Solutions', 'Leadership Summit'],
            createdAt: new Date('2024-01-01')
          },
          {
            id: '4',
            name: 'Event Enthusiasts',
            description: 'Users with high event attendance and engagement metrics',
            criteria: {
              type: 'engagement',
              rules: ['Events attended > 5', 'Average watch time > 60%', 'Q&A participation > 20%']
            },
            audienceSize: 5624,
            growthRate: 18.2,
            lastUpdated: new Date('2024-02-15'),
            isActive: true,
            conversionRate: 22.1,
            avgRevenue: 324.60,
            topEvents: ['Weekly Workshops', 'Expert Panels'],
            createdAt: new Date('2024-01-08')
          },
          {
            id: '5',
            name: 'At-Risk Subscribers',
            description: 'Previously active users showing declining engagement',
            criteria: {
              type: 'behavioral',
              rules: ['Last event attendance > 60 days', 'Email open rate < 10%', 'Previous purchase exists']
            },
            audienceSize: 2987,
            growthRate: -15.4,
            lastUpdated: new Date('2024-02-13'),
            isActive: false,
            conversionRate: 4.7,
            avgRevenue: 89.30,
            topEvents: ['Re-engagement Campaign'],
            createdAt: new Date('2024-01-15')
          },
          {
            id: '6',
            name: 'Mobile-First Audience',
            description: 'Users primarily accessing content via mobile devices',
            criteria: {
              type: 'behavioral',
              rules: ['Mobile sessions > 70%', 'Mobile app installed', 'Push notifications enabled']
            },
            audienceSize: 7432,
            growthRate: 24.8,
            lastUpdated: new Date('2024-02-16'),
            isActive: true,
            conversionRate: 15.6,
            avgRevenue: 198.40,
            topEvents: ['Mobile Workshops', 'Quick Tips'],
            createdAt: new Date('2024-01-12')
          }
        ]);

        setLoading(false);
      }, 1200);
    };

    loadData();
  }, []);

  const filteredSegments = segments.filter(segment => {
    const matchesSearch = segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         segment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || segment.criteria.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getCriteriaTypeBadge = (type: string) => {
    const variants = {
      behavioral: 'bg-purple-100 text-purple-800 border-purple-200',
      demographic: 'bg-blue-100 text-blue-800 border-blue-200',
      engagement: 'bg-green-100 text-green-800 border-green-200',
      custom: 'bg-orange-100 text-orange-800 border-orange-200'
    };

    return (
      <Badge className={`${variants[type as keyof typeof variants]} text-xs font-medium`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const statsData = stats ? [
    {
      title: 'Total Segments',
      value: stats.totalSegments,
      change: { value: '+2', trend: 'up' as const, period: 'this month' },
      icon: <Target className="w-6 h-6" />,
      iconColor: 'text-purple-600',
      description: 'Active audience segments'
    },
    {
      title: 'Total Audience',
      value: stats.totalAudience.toLocaleString(),
      change: { value: '+8.7%', trend: 'up' as const, period: 'vs last month' },
      icon: <Users className="w-6 h-6" />,
      iconColor: 'text-blue-600',
      description: 'Across all segments'
    },
    {
      title: 'Avg Conversion Rate',
      value: `${stats.avgConversion}%`,
      change: { value: '+2.1%', trend: 'up' as const, period: 'vs last month' },
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'text-green-600',
      description: 'Segment performance'
    },
    {
      title: 'Avg Revenue per User',
      value: `$${stats.avgRevenue}`,
      change: { value: '+$12.30', trend: 'up' as const, period: 'vs last month' },
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'text-indigo-600',
      description: 'Across all segments'
    }
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audience Segments"
        description="Create targeted audience segments for personalized marketing campaigns"
        icon={<Target className="w-6 h-6 text-purple-600" />}
        badge={{ text: "PRO", variant: "default" }}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Segments
            </Button>
            <Dialog open={isNewSegmentOpen} onOpenChange={setIsNewSegmentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Crown className="w-4 h-4 mr-2" />
                  <Plus className="w-4 h-4 mr-2" />
                  Create Segment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Segment</DialogTitle>
                  <DialogDescription>
                    Define your target audience criteria
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="segment-name">Segment Name</Label>
                    <Input id="segment-name" placeholder="Enter segment name" />
                  </div>
                  <div>
                    <Label htmlFor="segment-description">Description</Label>
                    <Input id="segment-description" placeholder="Describe your segment" />
                  </div>
                  <div>
                    <Label htmlFor="criteria-type">Criteria Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select criteria type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="demographic">Demographic</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewSegmentOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create Segment</Button>
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

      {/* Segments Table */}
      <Card className="border-0 shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Audience Segments
                <Crown className="w-4 h-4 ml-2 text-purple-600" />
              </h3>
              <p className="text-sm text-gray-600 mt-1">Create and manage targeted audience segments for enhanced engagement</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search segments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Type: {typeFilter === 'all' ? 'All' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('behavioral')}>Behavioral</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('demographic')}>Demographic</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('engagement')}>Engagement</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('custom')}>Custom</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-medium">Segment</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium">Audience Size</TableHead>
                <TableHead className="font-medium">Growth Rate</TableHead>
                <TableHead className="font-medium">Performance</TableHead>
                <TableHead className="font-medium">Last Updated</TableHead>
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
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
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
                filteredSegments.map((segment) => (
                  <TableRow key={segment.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{segment.name}</p>
                          {!segment.isActive && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs">{segment.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {segment.criteria.rules.slice(0, 2).map((rule, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {rule}
                            </Badge>
                          ))}
                          {segment.criteria.rules.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{segment.criteria.rules.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCriteriaTypeBadge(segment.criteria.type)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium text-gray-900">{segment.audienceSize.toLocaleString()}</span>
                        <p className="text-sm text-gray-500">contacts</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`font-medium ${segment.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {segment.growthRate >= 0 ? '+' : ''}{segment.growthRate}%
                        </span>
                        {segment.growthRate >= 0 ? (
                          <TrendingUp className="w-3 h-3 ml-1 text-green-600" />
                        ) : (
                          <TrendingUp className="w-3 h-3 ml-1 text-red-600 rotate-180" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Conversion:</span>
                          <span className="font-medium text-gray-900">{segment.conversionRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Avg Revenue:</span>
                          <span className="font-medium text-gray-900">${segment.avgRevenue}</span>
                        </div>
                        <Progress
                          value={segment.conversionRate}
                          className="h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-gray-900">{segment.lastUpdated.toLocaleDateString()}</span>
                        <p className="text-sm text-gray-500">
                          {Math.floor((new Date().getTime() - segment.lastUpdated.getTime()) / (1000 * 60 * 60 * 24))} days ago
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Segment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Create Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export List
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Segment
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

        {!loading && filteredSegments.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No segments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first audience segment to get started with targeted campaigns.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}