'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Zap,
  Settings,
  Globe,
  Mail,
  MessageSquare,
  Video,
  BarChart3,
  DollarSign,
  Webhook,
  Key,
  ExternalLink,
  MoreVertical,
  Plus,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const integrations = [
  {
    id: 1,
    name: 'Stripe',
    description: 'Payment processing for paid events and subscriptions',
    category: 'payment',
    icon: DollarSign,
    connected: true,
    status: 'Active',
    configuredBy: 'john@convertcast.com',
    lastSync: '2 minutes ago',
    features: ['Payment Processing', 'Subscription Management', 'Invoicing']
  },
  {
    id: 2,
    name: 'Mailgun',
    description: 'Email delivery and marketing automation',
    category: 'email',
    icon: Mail,
    connected: true,
    status: 'Active',
    configuredBy: 'sarah@convertcast.com',
    lastSync: '5 minutes ago',
    features: ['Email Delivery', 'Templates', 'Analytics']
  },
  {
    id: 3,
    name: 'Twilio',
    description: 'SMS notifications and communication',
    category: 'communication',
    icon: MessageSquare,
    connected: true,
    status: 'Active',
    configuredBy: 'mike@convertcast.com',
    lastSync: '1 hour ago',
    features: ['SMS Notifications', 'Voice Calls', 'WhatsApp']
  },
  {
    id: 4,
    name: 'Mux',
    description: 'Video streaming and encoding platform',
    category: 'streaming',
    icon: Video,
    connected: true,
    status: 'Active',
    configuredBy: 'emma@convertcast.com',
    lastSync: '30 minutes ago',
    features: ['Video Streaming', 'Encoding', 'Analytics']
  },
  {
    id: 5,
    name: 'Google Analytics',
    description: 'Track website and event performance',
    category: 'analytics',
    icon: BarChart3,
    connected: false,
    status: 'Available',
    features: ['Event Tracking', 'Audience Analytics', 'Conversion Tracking']
  },
  {
    id: 6,
    name: 'Zapier',
    description: 'Connect with 5000+ apps and automate workflows',
    category: 'automation',
    icon: Zap,
    connected: false,
    status: 'Available',
    features: ['Workflow Automation', '5000+ App Connections', 'Custom Triggers']
  }
];

const webhooks = [
  {
    id: 1,
    name: 'Event Registration Webhook',
    url: 'https://api.example.com/webhooks/registration',
    events: ['registration.created', 'registration.updated'],
    status: 'Active',
    lastTriggered: '2 minutes ago',
    successRate: '99.8%'
  },
  {
    id: 2,
    name: 'Payment Webhook',
    url: 'https://api.example.com/webhooks/payment',
    events: ['payment.completed', 'payment.failed'],
    status: 'Active',
    lastTriggered: '1 hour ago',
    successRate: '100%'
  }
];

const categoryIcons = {
  payment: DollarSign,
  email: Mail,
  communication: MessageSquare,
  streaming: Video,
  analytics: BarChart3,
  automation: Zap
};

const categoryColors = {
  payment: 'bg-green-100 text-green-800',
  email: 'bg-blue-100 text-blue-800',
  communication: 'bg-purple-100 text-purple-800',
  streaming: 'bg-red-100 text-red-800',
  analytics: 'bg-orange-100 text-orange-800',
  automation: 'bg-indigo-100 text-indigo-800'
};

export default function IntegrationsSettings() {
  const [selectedTab, setSelectedTab] = useState('integrations');
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const connectedIntegrations = integrations.filter(i => i.connected);
  const availableIntegrations = integrations.filter(i => !i.connected);

  const handleToggleIntegration = (integrationId: number) => {
    console.log('Toggle integration:', integrationId);
  };

  const handleCreateWebhook = () => {
    console.log('Creating webhook:', { webhookName, webhookUrl, selectedEvents });
    setIsWebhookOpen(false);
    setWebhookName('');
    setWebhookUrl('');
    setSelectedEvents([]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Integrations"
        description="Connect ConvertCast with your favorite tools and services"
        icon={Zap}
        iconBg="bg-indigo-100"
        gradient
      />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* Integration Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{connectedIntegrations.length}</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Globe className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{availableIntegrations.length}</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Webhook className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{webhooks.length}</p>
                    <p className="text-sm text-muted-foreground">Webhooks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Key className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-muted-foreground">API Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connected Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Integrations</CardTitle>
              <CardDescription>
                Manage your active integrations and their settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedIntegrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className={categoryColors[integration.category as keyof typeof categoryColors]}>
                              {integration.category}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800">
                              {integration.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Last sync: {integration.lastSync}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Docs
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Available Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>
                Connect new services to extend ConvertCast's functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableIntegrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <div key={integration.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {integration.features?.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Send real-time data to external services when events occur
                </CardDescription>
              </div>
              <Dialog open={isWebhookOpen} onOpenChange={setIsWebhookOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create Webhook</DialogTitle>
                    <DialogDescription>
                      Configure a new webhook to receive event notifications.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-name">Webhook Name</Label>
                      <Input
                        id="webhook-name"
                        placeholder="Enter webhook name"
                        value={webhookName}
                        onChange={(e) => setWebhookName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-url">Endpoint URL</Label>
                      <Input
                        id="webhook-url"
                        type="url"
                        placeholder="https://your-domain.com/webhook"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Events to Subscribe</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'registration.created',
                          'registration.updated',
                          'payment.completed',
                          'payment.failed',
                          'event.started',
                          'event.ended'
                        ].map((event) => (
                          <div key={event} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={event}
                              checked={selectedEvents.includes(event)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEvents([...selectedEvents, event]);
                                } else {
                                  setSelectedEvents(selectedEvents.filter(e => e !== event));
                                }
                              }}
                            />
                            <Label htmlFor={event} className="text-sm">
                              {event}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsWebhookOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWebhook} disabled={!webhookName || !webhookUrl}>
                      Create Webhook
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{webhook.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className="bg-green-100 text-green-800">
                          {webhook.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Success rate: {webhook.successRate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Last triggered: {webhook.lastTriggered}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access to ConvertCast
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">API Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to integrate with ConvertCast's REST API and webhook system.
                </p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View API Docs
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Production API Key</h3>
                      <p className="text-sm text-muted-foreground">Full access to production environment</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    pk_live_************************
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">Created: Oct 15, 2023</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Test API Key</h3>
                      <p className="text-sm text-muted-foreground">Safe testing environment access</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Test</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    pk_test_************************
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">Created: Sep 20, 2023</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}