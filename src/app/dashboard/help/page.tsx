'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Video,
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  Users,
  Zap,
  Shield,
  BarChart3,
  Settings,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

const quickActions = [
  {
    title: 'Getting Started Guide',
    description: 'Learn the basics of ConvertCast',
    icon: BookOpen,
    href: '/dashboard/help/getting-started',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step tutorials',
    icon: Video,
    href: '/dashboard/help/tutorials',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Contact Support',
    description: 'Get help from our team',
    icon: MessageSquare,
    href: '/dashboard/help/support',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'API Documentation',
    description: 'Technical integration guides',
    icon: Settings,
    href: '/dashboard/help/api-docs',
    color: 'bg-orange-100 text-orange-600'
  }
];

const popularArticles = [
  {
    id: 1,
    title: 'How to create your first webinar event',
    category: 'Getting Started',
    readTime: '5 min read',
    views: 1250,
    helpful: 94
  },
  {
    id: 2,
    title: 'Setting up payment processing with Stripe',
    category: 'Integrations',
    readTime: '8 min read',
    views: 890,
    helpful: 97
  },
  {
    id: 3,
    title: 'Customizing registration forms and landing pages',
    category: 'Customization',
    readTime: '6 min read',
    views: 730,
    helpful: 92
  },
  {
    id: 4,
    title: 'Understanding analytics and performance metrics',
    category: 'Analytics',
    readTime: '7 min read',
    views: 650,
    helpful: 89
  },
  {
    id: 5,
    title: 'Troubleshooting streaming and audio issues',
    category: 'Troubleshooting',
    readTime: '10 min read',
    views: 580,
    helpful: 95
  }
];

const categories = [
  {
    title: 'Getting Started',
    description: 'Basic setup and configuration',
    icon: Zap,
    articles: 12,
    color: 'bg-blue-50 border-blue-200'
  },
  {
    title: 'Event Management',
    description: 'Creating and managing events',
    icon: Users,
    articles: 18,
    color: 'bg-green-50 border-green-200'
  },
  {
    title: 'Analytics & Reporting',
    description: 'Understanding your data',
    icon: BarChart3,
    articles: 8,
    color: 'bg-purple-50 border-purple-200'
  },
  {
    title: 'Integrations',
    description: 'Third-party connections',
    icon: Settings,
    articles: 15,
    color: 'bg-orange-50 border-orange-200'
  },
  {
    title: 'Security & Privacy',
    description: 'Account and data protection',
    icon: Shield,
    articles: 6,
    color: 'bg-red-50 border-red-200'
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: HelpCircle,
    articles: 10,
    color: 'bg-yellow-50 border-yellow-200'
  }
];

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: 'Available 24/7',
    icon: MessageCircle,
    action: 'Start Chat',
    color: 'bg-blue-500'
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message',
    availability: 'Response within 2 hours',
    icon: Mail,
    action: 'Send Email',
    color: 'bg-green-500'
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our experts',
    availability: 'Mon-Fri 9AM-6PM PST',
    icon: Phone,
    action: 'Call Now',
    color: 'bg-purple-500'
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Help & Support"
        description="Find answers, tutorials, and get help from our team"
        icon={HelpCircle}
        iconBg="bg-blue-100"
        gradient
      />

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">How can we help you today?</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for answers, tutorials, or guides..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto mt-2 text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Knowledge Base</TabsTrigger>
          <TabsTrigger value="categories">Browse Categories</TabsTrigger>
          <TabsTrigger value="support">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Popular Articles</span>
              </CardTitle>
              <CardDescription>
                Most helpful articles from our knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex-1">
                      <h3 className="font-medium hover:text-blue-600">{article.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {article.views.toLocaleString()} views
                        </div>
                        <div className="text-sm text-green-600">
                          {article.helpful}% helpful
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Updated */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated</CardTitle>
              <CardDescription>
                Latest articles and documentation updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'New: Advanced Analytics Dashboard', category: 'Feature Updates', updated: '2 hours ago' },
                  { title: 'Updated: Stripe Integration Guide', category: 'Integrations', updated: '1 day ago' },
                  { title: 'New: Mobile App Setup Guide', category: 'Getting Started', updated: '3 days ago' },
                  { title: 'Updated: Security Best Practices', category: 'Security', updated: '1 week ago' }
                ].map((article, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <h4 className="font-medium text-sm hover:text-blue-600 cursor-pointer">{article.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        <span className="text-xs text-muted-foreground">Updated {article.updated}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className={`hover:shadow-md transition-shadow cursor-pointer ${category.color}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="secondary">{category.articles} articles</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.title} className="text-center">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                    <p className="text-xs text-muted-foreground mb-4">{option.availability}</p>
                    <Button className="w-full">{option.action}</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Community */}
          <Card>
            <CardHeader>
              <CardTitle>Community & Resources</CardTitle>
              <CardDescription>
                Connect with other ConvertCast users and access additional resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Community Forum</h4>
                      <p className="text-sm text-muted-foreground">Join discussions and share tips</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Video className="h-8 w-8 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Webinar Training</h4>
                      <p className="text-sm text-muted-foreground">Live training sessions</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <BookOpen className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-medium">Best Practices Guide</h4>
                      <p className="text-sm text-muted-foreground">Expert tips and strategies</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Settings className="h-8 w-8 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Developer Resources</h4>
                      <p className="text-sm text-muted-foreground">APIs, SDKs, and tools</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Page */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>System Status</span>
              </CardTitle>
              <CardDescription>
                All systems are operational
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Streaming Services</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Services</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dashboard</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Delivery</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Status Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}