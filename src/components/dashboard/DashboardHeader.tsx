"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  Plus,
  Settings,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
  Zap,
  Calendar,
  BarChart3,
  Users,
  Crown,
  Sparkles,
  ChevronDown,
  Command,
  MessageSquare,
  FileText,
  Gift,
  Shield,
  Moon,
  Sun,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  href?: string;
}

interface QuickAction {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  shortcut?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Event Started',
    message: 'Your webinar "Product Launch 2024" has started with 142 attendees.',
    time: '2 min ago',
    type: 'success',
    read: false,
    href: '/dashboard/events/live/123'
  },
  {
    id: '2',
    title: 'New Registration',
    message: '23 new attendees registered for your upcoming webinar.',
    time: '1 hour ago',
    type: 'info',
    read: false,
    href: '/dashboard/audience/attendees'
  },
  {
    id: '3',
    title: 'Payment Received',
    message: '$2,450 in revenue from your latest paid webinar.',
    time: '3 hours ago',
    type: 'success',
    read: true,
    href: '/dashboard/analytics/revenue'
  },
  {
    id: '4',
    title: 'Storage Warning',
    message: 'You are using 85% of your storage limit. Consider upgrading.',
    time: '1 day ago',
    type: 'warning',
    href: '/dashboard/settings/billing'
  }
];

const quickActions: QuickAction[] = [
  {
    title: 'Create Event',
    href: '/dashboard/events/create',
    icon: Calendar,
    description: 'Start a new webinar or meeting',
    shortcut: '⌘ + N'
  },
  {
    title: 'Go Live',
    href: '/dashboard/events/live',
    icon: Video,
    description: 'Start broadcasting immediately',
    shortcut: '⌘ + L'
  },
  {
    title: 'View Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Check your performance metrics',
    shortcut: '⌘ + A'
  },
  {
    title: 'Manage Audience',
    href: '/dashboard/audience',
    icon: Users,
    description: 'View attendees and registrations',
    shortcut: '⌘ + U'
  }
];

export function DashboardHeader({ title, subtitle, actions, className }: DashboardHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock user data - replace with actual user context
  const user = {
    name: "John Doe",
    email: "john@company.com",
    avatar: "",
    plan: "Professional",
    initials: "JD",
    eventsThisMonth: 8,
    totalAttendees: 1247
  };

  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    // Implement sign out logic
    console.log('Sign out');
  };

  const handleUpgrade = () => {
    router.push('/dashboard/settings/billing');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <header className={cn("bg-slate-900 border-b border-slate-800 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        {/* Left Section - Title & Breadcrumb */}
        <div className="flex items-center space-x-4">
          {title && (
            <div>
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search events, attendees, analytics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={cn(
                  "pl-10 pr-4 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500",
                  "focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
                  isSearchFocused && "ring-2 ring-purple-500 border-purple-500"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                  <Command className="w-3 h-3 inline mr-1" />K
                </kbd>
              </div>
            </div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
                >
                  <div className="p-2">
                    <p className="text-xs text-slate-400 mb-2">Quick Actions</p>
                    {quickActions.slice(0, 3).map((action) => (
                      <Link
                        key={action.title}
                        href={action.href}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700 transition-colors"
                      >
                        <action.icon className="w-4 h-4 text-purple-400" />
                        <div className="flex-1">
                          <p className="text-sm text-white">{action.title}</p>
                          <p className="text-xs text-slate-400">{action.description}</p>
                        </div>
                        {action.shortcut && (
                          <kbd className="text-xs text-slate-400">{action.shortcut}</kbd>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-3">
          {/* Quick Create Button */}
          <DropdownMenu open={showQuickActions} onOpenChange={setShowQuickActions}>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create
                <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
              <DropdownMenuLabel className="text-slate-300">Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              {quickActions.map((action) => (
                <DropdownMenuItem key={action.title} asChild>
                  <Link href={action.href} className="text-white hover:bg-slate-700">
                    <action.icon className="w-4 h-4 mr-3 text-purple-400" />
                    <div className="flex-1">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-slate-400">{action.description}</p>
                    </div>
                    {action.shortcut && (
                      <kbd className="text-xs text-slate-400 ml-2">{action.shortcut}</kbd>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-slate-800">
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
              <DropdownMenuLabel className="text-slate-300 flex items-center justify-between">
                Notifications
                {unreadNotifications > 0 && (
                  <Badge className="bg-red-500 text-white">{unreadNotifications} new</Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <div className="max-h-96 overflow-y-auto">
                {mockNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    asChild
                    className={cn(
                      "p-3 cursor-pointer",
                      !notification.read && "bg-purple-500/5"
                    )}
                  >
                    <Link href={notification.href || "#"} className="block">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-medium text-sm",
                            notification.read ? "text-slate-300" : "text-white"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1" />
                        )}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifications" className="text-center text-purple-400 hover:text-purple-300">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-white hover:bg-slate-800"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-slate-800">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.plan}</p>
                </div>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-slate-800 border-slate-700">
              <DropdownMenuLabel className="text-slate-300">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Badge className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                        <Sparkles className="h-2 w-2 mr-1" />
                        {user.plan}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-slate-700" />

              {/* Usage Stats */}
              <div className="px-3 py-2">
                <p className="text-xs text-slate-400 mb-2">This Month</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="font-medium text-white">{user.eventsThisMonth}</p>
                    <p className="text-slate-400">Events</p>
                  </div>
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="font-medium text-white">{user.totalAttendees}</p>
                    <p className="text-slate-400">Attendees</p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-slate-700" />

              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/account" className="text-white hover:bg-slate-700">
                  <User className="w-4 h-4 mr-3" />
                  Account Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/billing" className="text-white hover:bg-slate-700">
                  <CreditCard className="w-4 h-4 mr-3" />
                  Billing & Usage
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/security" className="text-white hover:bg-slate-700">
                  <Shield className="w-4 h-4 mr-3" />
                  Security
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-700" />

              <DropdownMenuItem onClick={handleUpgrade} className="text-white hover:bg-slate-700">
                <Crown className="w-4 h-4 mr-3 text-yellow-500" />
                Upgrade Plan
                <Badge className="ml-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Gift className="w-2 h-2 mr-1" />
                  25% OFF
                </Badge>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/help" className="text-white hover:bg-slate-700">
                  <HelpCircle className="w-4 h-4 mr-3" />
                  Help & Support
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-700" />

              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-red-500/10">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Custom Actions */}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}