"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Palette,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Download,
  Trash,
  Star,
  Heart,
  Layout,
  Mail,
  Globe,
  MessageSquare,
  FileText,
  Image,
  Zap,
  Crown,
  TrendingUp,
  Users,
  Clock,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'email' | 'landing-page' | 'sms' | 'push' | 'social';
  type: 'free' | 'premium' | 'custom';
  thumbnail: string;
  usage: number;
  rating: number;
  reviews: number;
  isPopular: boolean;
  isFavorite: boolean;
  tags: string[];
  createdAt: Date;
  lastUsed?: Date;
  author: string;
  conversionsAvg: number;
}

interface TemplateStats {
  totalTemplates: number;
  customTemplates: number;
  avgUsage: number;
  popularTemplates: number;
}

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'email' | 'landing-page' | 'sms' | 'push' | 'social'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'free' | 'premium' | 'custom'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TemplateStats | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setTimeout(() => {
        setStats({
          totalTemplates: 47,
          customTemplates: 8,
          avgUsage: 156,
          popularTemplates: 12
        });

        setTemplates([
          {
            id: '1',
            name: 'Modern Event Landing',
            description: 'Clean, conversion-optimized landing page template for professional events',
            category: 'landing-page',
            type: 'premium',
            thumbnail: '/templates/modern-event-landing.jpg',
            usage: 1247,
            rating: 4.8,
            reviews: 143,
            isPopular: true,
            isFavorite: false,
            tags: ['conversion', 'modern', 'responsive', 'professional'],
            createdAt: new Date('2024-01-15'),
            lastUsed: new Date('2024-02-14'),
            author: 'ConvertCast Team',
            conversionsAvg: 24.3
          },
          {
            id: '2',
            name: 'Welcome Email Series',
            description: 'Engaging welcome email template series for new subscribers',
            category: 'email',
            type: 'free',
            thumbnail: '/templates/welcome-email-series.jpg',
            usage: 2156,
            rating: 4.6,
            reviews: 287,
            isPopular: true,
            isFavorite: true,
            tags: ['welcome', 'onboarding', 'series', 'engagement'],
            createdAt: new Date('2024-01-10'),
            lastUsed: new Date('2024-02-15'),
            author: 'ConvertCast Team',
            conversionsAvg: 31.7
          },
          {
            id: '3',
            name: 'Event Reminder SMS',
            description: 'Short, impactful SMS template for event reminders',
            category: 'sms',
            type: 'free',
            thumbnail: '/templates/event-reminder-sms.jpg',
            usage: 892,
            rating: 4.4,
            reviews: 98,
            isPopular: false,
            isFavorite: false,
            tags: ['reminder', 'urgent', 'mobile', 'brief'],
            createdAt: new Date('2024-01-20'),
            lastUsed: new Date('2024-02-12'),
            author: 'ConvertCast Team',
            conversionsAvg: 18.9
          },
          {
            id: '4',
            name: 'Premium Webinar Promo',
            description: 'High-converting promotional template for premium webinars',
            category: 'email',
            type: 'premium',
            thumbnail: '/templates/premium-webinar-promo.jpg',
            usage: 678,
            rating: 4.9,
            reviews: 89,
            isPopular: true,
            isFavorite: false,
            tags: ['promotional', 'premium', 'conversion', 'sales'],
            createdAt: new Date('2024-01-08'),
            lastUsed: new Date('2024-02-13'),
            author: 'Marketing Pro',
            conversionsAvg: 28.4
          },
          {
            id: '5',
            name: 'Tech Conference Landing',
            description: 'Sleek, tech-focused landing page perfect for developer conferences',
            category: 'landing-page',
            type: 'free',
            thumbnail: '/templates/tech-conference-landing.jpg',
            usage: 534,
            rating: 4.5,
            reviews: 67,
            isPopular: false,
            isFavorite: true,
            tags: ['tech', 'developer', 'conference', 'modern'],
            createdAt: new Date('2024-01-25'),
            lastUsed: new Date('2024-02-10'),
            author: 'DevCommunity',
            conversionsAvg: 22.1
          },
          {
            id: '6',
            name: 'Push Notification Alert',
            description: 'Attention-grabbing push notification template for mobile users',
            category: 'push',
            type: 'free',
            thumbnail: '/templates/push-notification-alert.jpg',
            usage: 743,
            rating: 4.2,
            reviews: 52,
            isPopular: false,
            isFavorite: false,
            tags: ['push', 'mobile', 'alert', 'engagement'],
            createdAt: new Date('2024-02-01'),
            lastUsed: new Date('2024-02-11'),
            author: 'MobilePro',
            conversionsAvg: 15.6
          },
          {
            id: '7',
            name: 'My Custom Template',
            description: 'Custom email template created for our brand-specific campaigns',
            category: 'email',
            type: 'custom',
            thumbnail: '/templates/custom-email-template.jpg',
            usage: 89,
            rating: 5.0,
            reviews: 3,
            isPopular: false,
            isFavorite: true,
            tags: ['custom', 'branded', 'personal', 'unique'],
            createdAt: new Date('2024-02-05'),
            lastUsed: new Date('2024-02-16'),
            author: 'You',
            conversionsAvg: 34.2
          },
          {
            id: '8',
            name: 'Social Media Promo',
            description: 'Eye-catching social media template for event promotion',
            category: 'social',
            type: 'premium',
            thumbnail: '/templates/social-media-promo.jpg',
            usage: 456,
            rating: 4.7,
            reviews: 34,
            isPopular: false,
            isFavorite: false,
            tags: ['social', 'instagram', 'facebook', 'promotion'],
            createdAt: new Date('2024-01-30'),
            lastUsed: new Date('2024-02-09'),
            author: 'SocialGuru',
            conversionsAvg: 12.8
          }
        ]);

        setFavorites(['2', '5', '7']);
        setLoading(false);
      }, 1200);
    };

    loadData();
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'popular' && template.isPopular) ||
                      (activeTab === 'favorites' && favorites.includes(template.id)) ||
                      (activeTab === 'custom' && template.type === 'custom');
    return matchesSearch && matchesCategory && matchesType && matchesTab;
  });

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      'landing-page': <Globe className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      push: <Zap className="w-4 h-4" />,
      social: <Image className="w-4 h-4" />
    };
    return icons[category as keyof typeof icons] || <FileText className="w-4 h-4" />;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      free: 'bg-green-100 text-green-800 border-green-200',
      premium: 'bg-purple-100 text-purple-800 border-purple-200',
      custom: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    const icons = {
      free: null,
      premium: <Crown className="w-3 h-3 mr-1" />,
      custom: <Star className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${variants[type as keyof typeof variants]} flex items-center text-xs font-medium`}>
        {icons[type as keyof typeof icons]}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const statsData = stats ? [
    {
      title: 'Total Templates',
      value: stats.totalTemplates,
      change: { value: '+3', trend: 'up' as const, period: 'this month' },
      icon: <Palette className="w-6 h-6" />,
      iconColor: 'text-purple-600',
      description: 'Available templates'
    },
    {
      title: 'Custom Templates',
      value: stats.customTemplates,
      change: { value: '+2', trend: 'up' as const, period: 'this week' },
      icon: <Star className="w-6 h-6" />,
      iconColor: 'text-blue-600',
      description: 'Created by you'
    },
    {
      title: 'Avg Usage',
      value: stats.avgUsage,
      change: { value: '+28', trend: 'up' as const, period: 'vs last month' },
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'text-green-600',
      description: 'Uses per template'
    },
    {
      title: 'Popular Templates',
      value: stats.popularTemplates,
      change: { value: '+1', trend: 'up' as const, period: 'this month' },
      icon: <Heart className="w-6 h-6" />,
      iconColor: 'text-red-600',
      description: 'High-performing templates'
    }
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Browse, create, and manage templates for all your marketing content"
        icon={<Palette className="w-6 h-6 text-purple-600" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Dialog open={isNewTemplateOpen} onOpenChange={setIsNewTemplateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Custom Template</DialogTitle>
                  <DialogDescription>
                    Build your own template from scratch
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="Enter template name" />
                  </div>
                  <div>
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea
                      id="template-description"
                      placeholder="Describe your template..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Template</SelectItem>
                        <SelectItem value="landing-page">Landing Page</SelectItem>
                        <SelectItem value="sms">SMS Template</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                    <Input id="template-tags" placeholder="professional, modern, conversion..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewTemplateOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create Template</Button>
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

      {/* Template Filters & Tabs */}
      <Card className="border-0 shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="custom">My Templates</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Category
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCategoryFilter('all')}>All Categories</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter('email')}>Email</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter('landing-page')}>Landing Page</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter('sms')}>SMS</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter('push')}>Push</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter('social')}>Social</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Type
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('free')}>Free</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('premium')}>Premium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('custom')}>Custom</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Template Grid */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    {/* Template Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 opacity-80"></div>
                      {getCategoryIcon(template.category)}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm">
                          Use Template
                        </Button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex space-x-1">
                        {template.isPopular && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {getTypeBadge(template.type)}
                      </div>

                      {/* Favorite Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`absolute top-2 right-2 h-8 w-8 p-0 ${
                          favorites.includes(template.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(template.id);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Template Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">{template.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                          {template.rating}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>{template.usage} uses</span>
                        <span>by {template.author}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">Conv: {template.conversionsAvg}%</span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-3 w-3" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-3 w-3" />
                              Duplicate
                            </DropdownMenuItem>
                            {template.type === 'custom' && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-3 w-3" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-3 w-3" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Palette className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first custom template to get started.'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}