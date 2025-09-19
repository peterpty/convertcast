"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  UserPlus,
  Users,
  TrendingUp,
  Clock,
  Mail,
  Calendar,
  Download,
  Filter,
  Search,
  MoreVertical,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  QrCode,
  Link2,
  Copy,
  Share,
  Settings
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
import { Progress } from '@/components/ui/progress';

interface RegistrationForm {
  id: string;
  eventTitle: string;
  eventDate: Date;
  registrations: number;
  capacity: number;
  status: 'active' | 'paused' | 'closed';
  conversionRate: number;
  landingPageViews: number;
  createdAt: Date;
  registrationUrl: string;
}

interface RegistrationStats {
  totalRegistrations: number;
  activeEvents: number;
  averageConversion: number;
  totalViews: number;
}

export default function RegistrationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'closed'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [registrationForms, setRegistrationForms] = useState<RegistrationForm[]>([]);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalRegistrations: 12847,
          activeEvents: 8,
          averageConversion: 24.3,
          totalViews: 52890
        });

        setRegistrationForms([
          {
            id: '1',
            eventTitle: 'Digital Marketing Masterclass 2024',
            eventDate: new Date('2024-02-15T19:00:00'),
            registrations: 2847,
            capacity: 5000,
            status: 'active',
            conversionRate: 28.4,
            landingPageViews: 10032,
            createdAt: new Date('2024-01-10'),
            registrationUrl: 'https://convertcast.com/events/marketing-masterclass-2024'
          },
          {
            id: '2',
            eventTitle: 'AI Revolution in Business',
            eventDate: new Date('2024-02-20T18:00:00'),
            registrations: 1923,
            capacity: 3000,
            status: 'active',
            conversionRate: 31.2,
            landingPageViews: 6165,
            createdAt: new Date('2024-01-08'),
            registrationUrl: 'https://convertcast.com/events/ai-revolution-business'
          },
          {
            id: '3',
            eventTitle: 'E-commerce Growth Strategies',
            eventDate: new Date('2024-02-12T17:00:00'),
            registrations: 3421,
            capacity: 4000,
            status: 'paused',
            conversionRate: 26.8,
            landingPageViews: 12762,
            createdAt: new Date('2024-01-05'),
            registrationUrl: 'https://convertcast.com/events/ecommerce-growth'
          },
          {
            id: '4',
            eventTitle: 'Crypto Trading Fundamentals',
            eventDate: new Date('2024-02-08T20:00:00'),
            registrations: 1876,
            capacity: 2500,
            status: 'closed',
            conversionRate: 19.7,
            landingPageViews: 9523,
            createdAt: new Date('2024-01-01'),
            registrationUrl: 'https://convertcast.com/events/crypto-trading-fundamentals'
          },
          {
            id: '5',
            eventTitle: 'Personal Branding Workshop',
            eventDate: new Date('2024-02-25T16:00:00'),
            registrations: 1432,
            capacity: 2000,
            status: 'active',
            conversionRate: 22.1,
            landingPageViews: 6481,
            createdAt: new Date('2024-01-12'),
            registrationUrl: 'https://convertcast.com/events/personal-branding-workshop'
          },
          {
            id: '6',
            eventTitle: 'Investment Portfolio Optimization',
            eventDate: new Date('2024-03-01T19:30:00'),
            registrations: 987,
            capacity: 1500,
            status: 'active',
            conversionRate: 18.9,
            landingPageViews: 5224,
            createdAt: new Date('2024-01-15'),
            registrationUrl: 'https://convertcast.com/events/investment-portfolio'
          }
        ]);

        setLoading(false);
      }, 1200);
    };

    loadData();
  }, []);

  const filteredForms = registrationForms.filter(form => {
    const matchesSearch = form.eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const icons = {
      active: <CheckCircle className="w-3 h-3 mr-1" />,
      paused: <AlertCircle className="w-3 h-3 mr-1" />,
      closed: <XCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center text-xs font-medium`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // Would show toast notification in real app
  };

  const statsData = stats ? [
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations.toLocaleString(),
      change: { value: '+12.5%', trend: 'up' as const, period: 'vs last month' },
      icon: <UserPlus className="w-6 h-6" />,
      iconColor: 'text-green-600',
      description: 'Across all events'
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      change: { value: '+2', trend: 'up' as const, period: 'this week' },
      icon: <Calendar className="w-6 h-6" />,
      iconColor: 'text-blue-600',
      description: 'Currently accepting registrations'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.averageConversion}%`,
      change: { value: '+3.2%', trend: 'up' as const, period: 'vs last month' },
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'text-purple-600',
      description: 'Average across all forms'
    },
    {
      title: 'Landing Page Views',
      value: stats.totalViews.toLocaleString(),
      change: { value: '+18.7%', trend: 'up' as const, period: 'vs last month' },
      icon: <Eye className="w-6 h-6" />,
      iconColor: 'text-indigo-600',
      description: 'Total page visits'
    }
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registration Management"
        description="Manage event registration forms and track conversion performance"
        icon={<UserPlus className="w-6 h-6 text-purple-600" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Registration Settings
            </Button>
          </div>
        }
        gradient
      />

      {/* Stats Grid */}
      <StatsGrid stats={statsData} loading={loading} />

      {/* Registration Forms Table */}
      <Card className="border-0 shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Registration Forms</h3>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor your event registration forms</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
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
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                    Paused
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('closed')}>
                    Closed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-medium">Event</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Registration Progress</TableHead>
                <TableHead className="font-medium">Conversion Rate</TableHead>
                <TableHead className="font-medium">Page Views</TableHead>
                <TableHead className="font-medium">Event Date</TableHead>
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
                        <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
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
                filteredForms.map((form) => (
                  <TableRow key={form.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{form.eventTitle}</p>
                        <p className="text-sm text-gray-500">Created {form.createdAt.toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(form.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{form.registrations.toLocaleString()} / {form.capacity.toLocaleString()}</span>
                          <span className="text-gray-500">{Math.round((form.registrations / form.capacity) * 100)}%</span>
                        </div>
                        <Progress
                          value={(form.registrations / form.capacity) * 100}
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{form.conversionRate}%</span>
                        {form.conversionRate > 25 && (
                          <TrendingUp className="w-3 h-3 ml-1 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{form.landingPageViews.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{form.eventDate.toLocaleDateString()}</span>
                      <p className="text-sm text-gray-500">{form.eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                            <Settings className="mr-2 h-4 w-4" />
                            Edit Form
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyUrl(form.registrationUrl)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <QrCode className="mr-2 h-4 w-4" />
                            Generate QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Landing Page
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

        {!loading && filteredForms.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No registration forms found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first event registration form.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}