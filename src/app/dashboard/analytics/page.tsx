'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  DollarSign,
  Clock,
  PlayCircle,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Globe,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface AnalyticsData {
  viewers: number;
  watchTime: number;
  revenue: number;
  events: number;
  engagement: number;
  conversion: number;
}

interface TimeSeriesData {
  date: string;
  viewers: number;
  watchTime: number;
  revenue: number;
}

interface TopEvent {
  id: string;
  title: string;
  viewers: number;
  revenue: number;
  date: string;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Sample data - in production, this would come from your analytics API
  const [analyticsData] = useState<AnalyticsData>({
    viewers: 12847,
    watchTime: 89432, // minutes
    revenue: 15420,
    events: 24,
    engagement: 78.5,
    conversion: 3.2
  });

  const [timeSeriesData] = useState<TimeSeriesData[]>([
    { date: '2024-01-01', viewers: 1200, watchTime: 4800, revenue: 240 },
    { date: '2024-01-02', viewers: 1450, watchTime: 5200, revenue: 310 },
    { date: '2024-01-03', viewers: 1180, watchTime: 4600, revenue: 280 },
    { date: '2024-01-04', viewers: 1680, watchTime: 6100, revenue: 420 },
    { date: '2024-01-05', viewers: 2100, watchTime: 7200, revenue: 560 },
    { date: '2024-01-06', viewers: 1950, watchTime: 6800, revenue: 490 },
    { date: '2024-01-07', viewers: 2350, watchTime: 8100, revenue: 650 }
  ]);

  const [topEvents] = useState<TopEvent[]>([
    { id: '1', title: 'Master Digital Marketing 2024', viewers: 2847, revenue: 4200, date: '2024-01-05' },
    { id: '2', title: 'AI Tools for Content Creation', viewers: 2156, revenue: 3800, date: '2024-01-03' },
    { id: '3', title: 'E-commerce Conversion Strategies', viewers: 1923, revenue: 3200, date: '2024-01-01' },
    { id: '4', title: 'Social Media Growth Hacks', viewers: 1745, revenue: 2900, date: '2024-01-06' },
    { id: '5', title: 'Email Marketing Masterclass', viewers: 1634, revenue: 2650, date: '2024-01-02' }
  ]);

  const trafficSourceData = [
    { name: 'Direct', value: 35, color: '#8B5CF6' },
    { name: 'Social Media', value: 28, color: '#06B6D4' },
    { name: 'Email', value: 20, color: '#10B981' },
    { name: 'Search', value: 12, color: '#F59E0B' },
    { name: 'Referral', value: 5, color: '#EF4444' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const stats = [
    {
      title: 'Total Viewers',
      value: analyticsData.viewers.toLocaleString(),
      change: { value: '+12.5%', trend: 'up' as const, period: 'vs last period' },
      icon: <Users className="w-6 h-6" />,
      iconColor: 'text-purple-600'
    },
    {
      title: 'Watch Time',
      value: `${Math.floor(analyticsData.watchTime / 60)}h ${analyticsData.watchTime % 60}m`,
      change: { value: '+8.2%', trend: 'up' as const, period: 'vs last period' },
      icon: <Clock className="w-6 h-6" />,
      iconColor: 'text-blue-600'
    },
    {
      title: 'Revenue',
      value: `$${analyticsData.revenue.toLocaleString()}`,
      change: { value: '+24.1%', trend: 'up' as const, period: 'vs last period' },
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'text-green-600'
    },
    {
      title: 'Events',
      value: analyticsData.events,
      change: { value: '+3', trend: 'up' as const, period: 'this month' },
      icon: <PlayCircle className="w-6 h-6" />,
      iconColor: 'text-orange-600'
    },
    {
      title: 'Engagement Rate',
      value: `${analyticsData.engagement}%`,
      change: { value: '+2.1%', trend: 'up' as const, period: 'vs last period' },
      icon: <Activity className="w-6 h-6" />,
      iconColor: 'text-pink-600'
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData.conversion}%`,
      change: { value: '+0.3%', trend: 'up' as const, period: 'vs last period' },
      icon: <Target className="w-6 h-6" />,
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Analytics"
        description="Track your streaming performance and audience insights"
        icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
        badge={{ text: 'Live Data', variant: 'default' }}
        actions={
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
        gradient
      />

      {/* Key Metrics */}
      <div className="mb-8">
        <StatsGrid stats={stats.slice(0, 4)} columns={4} loading={loading} />
      </div>

      <div className="mb-8">
        <StatsGrid stats={stats.slice(4, 6)} columns={2} loading={loading} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Viewers Over Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Viewer Trends</h3>
              <p className="text-gray-600 text-sm">Daily viewer count over time</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="viewersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                formatter={(value: number) => [value.toLocaleString(), 'Viewers']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="viewers"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#viewersGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Tracking */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
              <p className="text-gray-600 text-sm">Daily revenue trends</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <DollarSign className="w-3 h-3 mr-1" />
              +24.1%
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                formatter={(value: number) => [`$${value}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
              <p className="text-gray-600 text-sm">Where your viewers come from</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <Globe className="w-3 h-3 mr-1" />
              5 Sources
            </Badge>
          </div>
          <div className="flex items-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-6 space-y-2">
              {trafficSourceData.map((source, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-gray-600 mr-2">{source.name}</span>
                  <span className="font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Watch Time Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Watch Time Analysis</h3>
              <p className="text-gray-600 text-sm">Total watch time trends</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              <Zap className="w-3 h-3 mr-1" />
              High Engagement
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), 'MM/dd')}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                formatter={(value: number) => [`${Math.floor(value/60)}h ${value%60}m`, 'Watch Time']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="watchTime"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Events</h3>
            <p className="text-gray-600 text-sm">Your most successful events this period</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-900">Event</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Viewers</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Revenue</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topEvents.map((event, index) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{event.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-gray-600">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-medium">{event.viewers.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-medium text-green-600">${event.revenue.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Excellent
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}