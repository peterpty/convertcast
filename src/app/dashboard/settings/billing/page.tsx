"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Crown,
  Star,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Plus,
  Trash,
  Receipt,
  FileText,
  Clock,
  Users,
  Globe,
  Settings,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface BillingInfo {
  currentPlan: {
    name: string;
    price: number;
    interval: 'monthly' | 'yearly';
    features: string[];
    limits: {
      events: number;
      attendees: number;
      storage: string;
    };
  };
  nextBilling: Date;
  paymentMethod: {
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
    expiry?: string;
  };
  billingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

interface UsageStats {
  eventsUsed: number;
  eventsLimit: number;
  attendeesUsed: number;
  attendeesLimit: number;
  storageUsed: string;
  storageLimit: string;
  storagePercent: number;
}

const plans = [
  {
    name: 'Starter',
    price: 29,
    interval: 'monthly' as const,
    yearlyPrice: 290,
    features: [
      'Up to 5 events per month',
      '500 attendees per event',
      '10GB storage',
      'Basic analytics',
      'Email support'
    ],
    limits: { events: 5, attendees: 500, storage: '10GB' },
    popular: false
  },
  {
    name: 'Professional',
    price: 79,
    interval: 'monthly' as const,
    yearlyPrice: 790,
    features: [
      'Up to 20 events per month',
      '2,000 attendees per event',
      '100GB storage',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'API access'
    ],
    limits: { events: 20, attendees: 2000, storage: '100GB' },
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199,
    interval: 'monthly' as const,
    yearlyPrice: 1990,
    features: [
      'Unlimited events',
      '10,000+ attendees per event',
      '1TB storage',
      'Advanced analytics & reporting',
      '24/7 priority support',
      'White-label solution',
      'SSO & advanced security',
      'Dedicated account manager'
    ],
    limits: { events: -1, attendees: 10000, storage: '1TB' },
    popular: false
  }
];

export default function BillingSettingsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Simulate data loading
  useEffect(() => {
    const loadData = () => {
      setBillingInfo({
        currentPlan: {
          name: 'Professional',
          price: 79,
          interval: 'monthly',
          features: [
            'Up to 20 events per month',
            '2,000 attendees per event',
            '100GB storage',
            'Advanced analytics',
            'Priority support',
            'Custom branding',
            'API access'
          ],
          limits: { events: 20, attendees: 2000, storage: '100GB' }
        },
        nextBilling: new Date('2024-03-15'),
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiry: '12/27'
        },
        billingAddress: {
          name: 'John Doe',
          company: 'Marketing Solutions Inc.',
          address: '123 Business Ave',
          city: 'San Francisco',
          state: 'CA',
          zip: '94107',
          country: 'United States'
        }
      });

      setUsage({
        eventsUsed: 12,
        eventsLimit: 20,
        attendeesUsed: 8547,
        attendeesLimit: 2000,
        storageUsed: '67GB',
        storageLimit: '100GB',
        storagePercent: 67
      });

      setInvoices([
        {
          id: 'INV-2024-002',
          date: new Date('2024-02-15'),
          amount: 79.00,
          status: 'paid',
          description: 'Professional Plan - February 2024',
          downloadUrl: '/invoices/inv-2024-002.pdf'
        },
        {
          id: 'INV-2024-001',
          date: new Date('2024-01-15'),
          amount: 79.00,
          status: 'paid',
          description: 'Professional Plan - January 2024',
          downloadUrl: '/invoices/inv-2024-001.pdf'
        },
        {
          id: 'INV-2023-012',
          date: new Date('2023-12-15'),
          amount: 79.00,
          status: 'paid',
          description: 'Professional Plan - December 2023',
          downloadUrl: '/invoices/inv-2023-012.pdf'
        },
        {
          id: 'INV-2023-011',
          date: new Date('2023-11-15'),
          amount: 29.00,
          status: 'paid',
          description: 'Starter Plan - November 2023',
          downloadUrl: '/invoices/inv-2023-011.pdf'
        }
      ]);
    };

    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      paid: <CheckCircle className="w-3 h-3 mr-1" />,
      pending: <Clock className="w-3 h-3 mr-1" />,
      failed: <XCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center text-xs font-medium`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handlePlanChange = (planName: string) => {
    setSelectedPlan(planName);
    setShowPlanDialog(true);
  };

  const confirmPlanChange = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Changing to ${selectedPlan} plan`);
      setShowPlanDialog(false);
      setLoading(false);
    }, 2000);
  };

  if (!billingInfo || !usage) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Usage"
        description="Manage your subscription, billing information, and usage statistics"
        icon={<CreditCard className="w-6 h-6 text-blue-600" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Invoices
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        }
        gradient
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan Card */}
          <Card className="border-0 shadow-lg">
            <div className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">{billingInfo.currentPlan.name} Plan</h3>
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
                        Current
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      ${billingInfo.currentPlan.price}/{billingInfo.currentPlan.interval}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Next billing date</p>
                  <p className="font-semibold text-gray-900">{billingInfo.nextBilling.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Statistics */}
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Current Usage</h3>
              <p className="text-sm text-gray-600 mt-1">Your usage for this billing period</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-20 h-20">
                      <Progress
                        value={(usage.eventsUsed / usage.eventsLimit) * 100}
                        className="h-20 w-20 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900">Events</h4>
                  <p className="text-2xl font-bold text-purple-600">{usage.eventsUsed}</p>
                  <p className="text-sm text-gray-500">of {usage.eventsLimit} used</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-20 h-20">
                      <Progress
                        value={(usage.attendeesUsed / usage.attendeesLimit) * 100}
                        className="h-20 w-20 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900">Attendees</h4>
                  <p className="text-2xl font-bold text-blue-600">{usage.attendeesUsed.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">across all events</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-20 h-20">
                      <Progress
                        value={usage.storagePercent}
                        className="h-20 w-20 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900">Storage</h4>
                  <p className="text-2xl font-bold text-green-600">{usage.storageUsed}</p>
                  <p className="text-sm text-gray-500">of {usage.storageLimit} used</p>
                </div>
              </div>

              {/* Usage Warnings */}
              {(usage.eventsUsed / usage.eventsLimit) > 0.8 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Approaching Event Limit</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        You've used {usage.eventsUsed} of your {usage.eventsLimit} monthly events. Consider upgrading your plan.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                  <p className="text-sm text-gray-600 mt-1">Your default payment method</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {billingInfo.paymentMethod.brand} •••• {billingInfo.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-500">Expires {billingInfo.paymentMethod.expiry}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {/* Billing Toggle */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <span className={`${billingInterval === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative"
                >
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    billingInterval === 'yearly' ? 'bg-purple-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                      billingInterval === 'yearly' ? 'translate-x-6 ml-1' : 'translate-x-0 ml-0.5'
                    }`} />
                  </div>
                </Button>
                <span className={`${billingInterval === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Yearly
                </span>
                {billingInterval === 'yearly' && (
                  <Badge className="bg-green-100 text-green-800">Save 20%</Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.price;
              const isCurrentPlan = plan.name === billingInfo.currentPlan.name;

              return (
                <Card key={plan.name} className={`relative border-0 shadow-lg ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                } ${isCurrentPlan ? 'bg-gradient-to-br from-purple-50 to-blue-50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-gray-900">${price}</span>
                        <span className="text-gray-500">/{billingInterval === 'yearly' ? 'year' : 'month'}</span>
                      </div>
                      {billingInterval === 'yearly' && (
                        <p className="text-sm text-green-600">
                          Save ${(plan.price * 12) - plan.yearlyPrice} per year
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <Button disabled className="w-full" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handlePlanChange(plan.name)}
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade to ' + plan.name}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
                  <p className="text-sm text-gray-600 mt-1">Download and view your past invoices</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-medium">Invoice</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Amount</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{invoice.id}</p>
                          <p className="text-sm text-gray-500">{invoice.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900">{invoice.date.toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">${invoice.amount.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            <Receipt className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your payment methods and billing address</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Current Payment Method */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {billingInfo.paymentMethod.brand} •••• {billingInfo.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-gray-500">Expires {billingInfo.paymentMethod.expiry}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Default</Badge>
              </div>

              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </Card>

          {/* Billing Address */}
          <Card className="border-0 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
                  <p className="text-sm text-gray-600 mt-1">Address used for billing and invoices</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{billingInfo.billingAddress.name}</p>
                {billingInfo.billingAddress.company && (
                  <p className="text-gray-600">{billingInfo.billingAddress.company}</p>
                )}
                <p className="text-gray-600">{billingInfo.billingAddress.address}</p>
                <p className="text-gray-600">
                  {billingInfo.billingAddress.city}, {billingInfo.billingAddress.state} {billingInfo.billingAddress.zip}
                </p>
                <p className="text-gray-600">{billingInfo.billingAddress.country}</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plan Change Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              You're about to change your plan to {selectedPlan}. This change will take effect immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your plan will be upgraded immediately</li>
                <li>• You'll be charged a prorated amount for the current billing period</li>
                <li>• Your next billing date remains the same</li>
                <li>• New plan features are available right away</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmPlanChange}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? 'Processing...' : `Upgrade to ${selectedPlan}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}