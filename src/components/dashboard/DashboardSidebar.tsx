"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  BarChart3,
  Calendar,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Plus,
  Play,
  LayoutDashboard,
  CalendarDays,
  CheckCircle,
  FileX,
  TrendingUp,
  Activity,
  DollarSign,
  Heart,
  UserPlus,
  Mail,
  MessageSquare,
  UserCheck,
  Globe,
  Send,
  Palette,
  User,
  CreditCard,
  Shield,
  Zap,
  BookOpen,
  Video,
  MessageCircle,
  Menu,
  X,
  LogOut,
  Crown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
  isNew?: boolean;
  isPro?: boolean;
}

interface DashboardSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: "New",
  },
  {
    title: "Events",
    icon: Calendar,
    children: [
      { title: "All Events", href: "/dashboard/events", icon: CalendarDays },
      { title: "Live Now", href: "/dashboard/events/live", icon: Video, badge: 2 },
      { title: "Scheduled", href: "/dashboard/events/scheduled", icon: Calendar },
      { title: "Completed", href: "/dashboard/events/completed", icon: CheckCircle },
      { title: "Drafts", href: "/dashboard/events/drafts", icon: FileX },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "/dashboard/analytics", icon: TrendingUp },
      { title: "Performance", href: "/dashboard/analytics/performance", icon: Activity },
      { title: "Revenue", href: "/dashboard/analytics/revenue", icon: DollarSign, isPro: true },
      { title: "Engagement", href: "/dashboard/analytics/engagement", icon: Heart },
    ],
  },
  {
    title: "Audience",
    icon: Users,
    children: [
      { title: "Attendees", href: "/dashboard/audience/attendees", icon: UserCheck },
      { title: "Registration", href: "/dashboard/audience/registration", icon: UserPlus },
      { title: "Communication", href: "/dashboard/audience/communication", icon: MessageSquare, isNew: true },
      { title: "Segments", href: "/dashboard/audience/segments", icon: Users, isPro: true },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    children: [
      { title: "Landing Pages", href: "/dashboard/content/landing-pages", icon: Globe },
      { title: "Email Campaigns", href: "/dashboard/content/emails", icon: Mail },
      { title: "Templates", href: "/dashboard/content/templates", icon: Palette },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Account", href: "/dashboard/settings/account", icon: User },
      { title: "Billing", href: "/dashboard/settings/billing", icon: CreditCard },
      { title: "Team", href: "/dashboard/settings/team", icon: Users, isPro: true },
      { title: "Security", href: "/dashboard/settings/security", icon: Shield },
      { title: "Integrations", href: "/dashboard/settings/integrations", icon: Zap, isNew: true },
    ],
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    children: [
      { title: "Documentation", href: "/dashboard/help/docs", icon: BookOpen },
      { title: "Video Tutorials", href: "/dashboard/help/tutorials", icon: Video },
      { title: "Contact Support", href: "/dashboard/help/contact", icon: MessageCircle },
    ],
  },
];

export function DashboardSidebar({ isCollapsed = false, onToggle, className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Mock user data - replace with actual user context
  const user = {
    name: "John Doe",
    email: "john@company.com",
    avatar: "",
    plan: "Professional",
    initials: "JD"
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-expand parent items based on current path
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const expandItems: string[] = [];

    navigationItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.href === pathname);
        if (hasActiveChild) {
          expandItems.push(item.title);
        }
      }
    });

    setExpandedItems(expandItems);
  }, [pathname]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    // Implement sign out logic
    console.log('Sign out');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Play className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-white">ConvertCast</span>
          )}
        </Link>

        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Create Event Button */}
      <div className="p-4">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Link href="/dashboard/events/create">
            <Plus className="h-4 w-4 mr-2" />
            {!isCollapsed && "Create Event"}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              // Parent with children
              <div>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    "text-slate-300 hover:text-white hover:bg-slate-800",
                    expandedItems.includes(item.title) && "text-white bg-slate-800"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3" />
                    {!isCollapsed && (
                      <span className="flex-1 text-left">{item.title}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center space-x-1">
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {expandedItems.includes(item.title) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </div>
                  )}
                </button>

                {/* Children */}
                <AnimatePresence>
                  {(expandedItems.includes(item.title) || isCollapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-1 space-y-1"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href || "#"}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                            isActive(child.href)
                              ? "text-white bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-l-2 border-purple-500"
                              : "text-slate-400 hover:text-white hover:bg-slate-800"
                          )}
                        >
                          <child.icon className="h-3 w-3 mr-3" />
                          {!isCollapsed && (
                            <span className="flex-1">{child.title}</span>
                          )}
                          {!isCollapsed && (
                            <div className="flex items-center space-x-1">
                              {child.badge && (
                                <Badge
                                  variant={typeof child.badge === 'number' ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {child.badge}
                                </Badge>
                              )}
                              {child.isNew && (
                                <Badge className="text-xs bg-green-600">
                                  NEW
                                </Badge>
                              )}
                              {child.isPro && (
                                <Badge className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                                  <Crown className="h-2 w-2 mr-1" />
                                  PRO
                                </Badge>
                              )}
                            </div>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Single item
              <Link
                href={item.href || "#"}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href)
                    ? "text-white bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-l-2 border-purple-500"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 mr-3" />
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
              {user.initials}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
                <Badge className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                  <Sparkles className="h-2 w-2 mr-1" />
                  {user.plan}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          )}

          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden text-white bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-80 lg:hidden"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 80 : 320 }}
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn("relative hidden lg:block", className)}
    >
      {sidebarContent}

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800"
      >
        <ChevronRight className={cn("h-3 w-3 transition-transform", isCollapsed && "rotate-180")} />
      </Button>
    </motion.aside>
  );
}