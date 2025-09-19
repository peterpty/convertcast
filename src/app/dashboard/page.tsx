"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard, QuickAction, EventCard } from "@/components/dashboard";
import Link from "next/link";
import {
  Calendar,
  Users,
  TrendingUp,
  Video,
  Plus,
  DollarSign,
  Target,
  PlayCircle,
  Star,
  ArrowRight
} from "lucide-react";

const dashboardStats = [
  {
    title: "Total Events",
    value: "24",
    change: "+12%",
    trending: "up",
    icon: Calendar,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Total Attendees",
    value: "1,847",
    change: "+18%",
    trending: "up",
    icon: Users,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Revenue",
    value: "$12,450",
    change: "+25%",
    trending: "up",
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Conversion Rate",
    value: "68%",
    change: "+8%",
    trending: "up",
    icon: Target,
    gradient: "from-orange-500 to-red-500"
  }
];

const recentEvents = [
  {
    id: 1,
    title: "Product Launch Webinar",
    date: "2024-01-15",
    time: "2:00 PM",
    attendees: 245,
    status: "completed",
    revenue: "$2,450"
  },
  {
    id: 2,
    title: "Q4 Strategy Session",
    date: "2024-01-18",
    time: "10:00 AM",
    attendees: 89,
    status: "live",
    revenue: "$890"
  },
  {
    id: 3,
    title: "Customer Success Workshop",
    date: "2024-01-20",
    time: "3:00 PM",
    attendees: 156,
    status: "scheduled",
    revenue: "$1,560"
  }
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500 animate-pulse";
      case "scheduled": return "bg-blue-500";
      case "completed": return "bg-green-500";
      default: return "bg-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        title="Dashboard"
        subtitle={`${greeting}! Here's what's happening with your events.`}
        headerActions={
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Link href="/dashboard/events/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
        }
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Welcome to ConvertCast! 👋
                </h1>
                <p className="text-slate-300">
                  You have 2 events scheduled for today and your audience is growing.
                </p>
              </div>
              <div className="hidden md:block">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Professional Plan
                </Badge>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType="positive"
                icon={stat.icon}
                gradient={stat.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Recent Events</CardTitle>
                      <CardDescription>Your latest webinars and meetings</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/events">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-slate-600/50 rounded-lg">
                            <PlayCircle className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{event.title}</h3>
                            <p className="text-sm text-white/60">{event.date} at {event.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">{event.attendees} attendees</div>
                            <div className="text-xs text-green-400">{event.revenue}</div>
                          </div>
                          <Badge className={`${getStatusColor(event.status)} text-white`}>
                            {event.status === "live" && <Video className="w-3 h-3 mr-1" />}
                            {event.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <QuickAction
                      title="Create New Event"
                      description="Start a new webinar or meeting"
                      href="/dashboard/events/new"
                      icon={Plus}
                      iconColor="text-purple-400"
                      delay={0.1}
                    />
                    <QuickAction
                      title="Go Live Now"
                      description="Start broadcasting immediately"
                      href="/dashboard/live"
                      icon={Video}
                      iconColor="text-red-400"
                      delay={0.2}
                    />
                    <QuickAction
                      title="View Analytics"
                      description="Check your performance metrics"
                      href="/dashboard/analytics"
                      icon={TrendingUp}
                      iconColor="text-green-400"
                      delay={0.3}
                    />
                    <QuickAction
                      title="Manage Participants"
                      description="View and manage attendees"
                      href="/dashboard/participants"
                      icon={Users}
                      iconColor="text-blue-400"
                      delay={0.4}
                    />
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-white mb-1">Pro Tip</h3>
                        <p className="text-xs text-white/70">
                          Schedule your next event 3-5 days in advance to maximize registrations and build anticipation.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}