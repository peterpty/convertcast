"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  Zap,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Calendar,
  Workflow,
  Plug,
  ArrowRight,
  Star,
  X,
  CheckCircle,
  AlertTriangle,
  Flame,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Play,
  Users,
  Clock,
  Target,
  Mail,
  Smartphone,
  Brain,
  Globe,
  Shield,
  Gauge,
  Heart,
  Megaphone,
  MousePointer,
  Calendar as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FeatureContent {
  icon: any;
  name: string;
  benefit: string;
  description: string;
  category: string;
  color: string;
  bgColor: string;
  improvement: string;
  metric: string;
  modalContent: {
    videoUrl?: string;
    keyFeatures: string[];
    useCases: string[];
    metrics: { label: string; value: string; icon: any }[];
    workflow: { step: string; description: string }[];
    testimonial?: { quote: string; author: string; role: string };
    demoElements?: { title: string; description: string; icon: any }[];
  };
}

const ecosystemFeatures: FeatureContent[] = [
  {
    icon: UserCheck,
    name: "ShowUp Surge™",
    benefit: "Never Feel Empty",
    description: "Get people to actually show up with AI-powered reminder sequences that boost attendance to 50-70%",
    category: "Acquisition",
    color: "from-emerald-500 to-green-500",
    bgColor: "from-emerald-500/10 to-green-500/10",
    improvement: "50-70%",
    metric: "Attendance Rate",
    modalContent: {
      videoUrl: "https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true",
      keyFeatures: [
        "AI-Powered Reminder Sequences",
        "Multi-Channel Communication (Email, SMS, Push)",
        "Behavioral Trigger Automation",
        "Personalized Attendance Incentives",
        "Real-Time Engagement Tracking"
      ],
      useCases: [
        "Boost webinar attendance rates by 50-70%",
        "Reduce no-show rates for live events",
        "Maximize ROI on marketing spend",
        "Build audience anticipation and excitement"
      ],
      metrics: [
        { label: "Average Attendance Increase", value: "60%", icon: TrendingUpIcon },
        { label: "Reminder Open Rate", value: "85%", icon: Mail },
        { label: "SMS Response Rate", value: "40%", icon: Smartphone },
        { label: "Push Notification CTR", value: "25%", icon: MousePointer }
      ],
      workflow: [
        { step: "Registration", description: "User signs up and triggers the ShowUp Surge™ sequence" },
        { step: "AI Analysis", description: "System analyzes user behavior and preferences" },
        { step: "Personalized Reminders", description: "Tailored reminders sent via optimal channels" },
        { step: "Engagement Tracking", description: "Real-time monitoring of user engagement" },
        { step: "Show Time", description: "Higher attendance rates and engaged audience" }
      ],
      testimonial: {
        quote: "ShowUp Surge™ transformed our webinar attendance from 30% to 72%. The AI knows exactly when and how to remind each person.",
        author: "Sarah Chen",
        role: "Marketing Director, TechFlow"
      }
    }
  },
  {
    icon: Zap,
    name: "EngageMax™",
    benefit: "Captivated Audiences",
    description: "Keep audiences hooked throughout with real-time interaction tools and engagement triggers",
    category: "Engagement",
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-500/10 to-violet-500/10",
    improvement: "70%+",
    metric: "Engagement Rate",
    modalContent: {
      videoUrl: "https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true",
      keyFeatures: [
        "Interactive Pop-up CTAs",
        "Real-time Emoji Reactions",
        "Gamified Polls & Quizzes",
        "Adaptive Engagement Scripts",
        "Attention-Restoration Alerts"
      ],
      useCases: [
        "Maintain 70%+ engagement throughout webinars",
        "Create interactive learning experiences",
        "Build community during presentations",
        "Gather real-time audience feedback"
      ],
      metrics: [
        { label: "Engagement Duration", value: "87%", icon: Clock },
        { label: "Interaction Rate", value: "73%", icon: MousePointer },
        { label: "Poll Participation", value: "65%", icon: Target },
        { label: "Emoji Reactions", value: "12/min", icon: Heart }
      ],
      workflow: [
        { step: "Audience Join", description: "Viewers enter the interactive webinar environment" },
        { step: "Real-time Analysis", description: "AI monitors engagement levels and attention" },
        { step: "Dynamic Triggers", description: "System activates polls, CTAs, and interactions" },
        { step: "Community Building", description: "Emoji reactions and chat create social proof" },
        { step: "Sustained Interest", description: "70%+ engagement maintained throughout" }
      ],
      testimonial: {
        quote: "EngageMax™ turned our boring presentations into interactive experiences. Engagement went from 40% to 78% overnight.",
        author: "Mike Rodriguez",
        role: "Head of Sales Training, EduTech Pro"
      },
      demoElements: [
        { title: "Live Polls", description: "Interactive polls appear automatically at optimal moments", icon: Target },
        { title: "Emoji Storm", description: "Audience reactions create engaging visual feedback", icon: Heart },
        { title: "Smart CTAs", description: "Context-aware call-to-actions based on content", icon: MousePointer }
      ]
    }
  },
  {
    icon: TrendingUp,
    name: "AutoOffer™",
    benefit: "Effortless Sales",
    description: "Intelligent offer presentation that adapts to audience behavior for 50% higher conversions",
    category: "Conversion",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    improvement: "50%+",
    metric: "Conversion Rate",
    modalContent: {
      videoUrl: "https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true",
      keyFeatures: [
        "Behavioral Conversion Triggers",
        "In-Stream Checkout Experience",
        "Dynamic Pricing & Urgency",
        "Payment Processing Integration",
        "Conversion Optimization AI"
      ],
      useCases: [
        "Increase sales conversions by 50%+",
        "Reduce checkout abandonment",
        "Optimize offer timing and presentation",
        "Process payments without page redirects"
      ],
      metrics: [
        { label: "Conversion Rate Increase", value: "52%", icon: TrendingUpIcon },
        { label: "Checkout Completion", value: "89%", icon: CheckCircle },
        { label: "Average Order Value", value: "+34%", icon: TrendingUpIcon },
        { label: "Time to Purchase", value: "2.3min", icon: Clock }
      ],
      workflow: [
        { step: "Engagement Tracking", description: "AI monitors viewer behavior and interest signals" },
        { step: "Optimal Timing", description: "System identifies perfect moment for offer presentation" },
        { step: "Dynamic Offer", description: "Personalized offer appears with optimal pricing" },
        { step: "In-Stream Checkout", description: "Seamless purchase without leaving the webinar" },
        { step: "Instant Confirmation", description: "Immediate purchase confirmation and delivery" }
      ],
      testimonial: {
        quote: "AutoOffer™ eliminated our biggest conversion bottleneck. Sales increased 53% and checkout abandonment dropped to just 11%.",
        author: "Lisa Wang",
        role: "Revenue Operations, ConvertPro"
      }
    }
  },
  {
    icon: MessageSquare,
    name: "AI Live Chat",
    benefit: "Authentic Feel",
    description: "Natural chat interactions that build trust and community feeling at scale",
    category: "Engagement",
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-500/10 to-rose-500/10",
    improvement: "10x",
    metric: "Community Trust",
    modalContent: {
      videoUrl: "https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true",
      keyFeatures: [
        "Natural Language Processing",
        "Automated Social Proof",
        "Intelligent Chat Moderation",
        "Engagement Amplification",
        "Trust Signal Generation"
      ],
      useCases: [
        "Create authentic community feeling",
        "Generate social proof at scale",
        "Moderate chat automatically",
        "Amplify positive engagement"
      ],
      metrics: [
        { label: "Chat Engagement", value: "10x", icon: MessageSquare },
        { label: "Trust Score", value: "94%", icon: Shield },
        { label: "Moderation Accuracy", value: "98%", icon: CheckCircle },
        { label: "Response Time", value: "0.3s", icon: Clock }
      ],
      workflow: [
        { step: "Chat Monitoring", description: "AI analyzes all chat messages in real-time" },
        { step: "Content Generation", description: "System creates natural, contextual responses" },
        { step: "Social Proof", description: "Authentic-feeling engagement and testimonials appear" },
        { step: "Moderation", description: "Inappropriate content filtered automatically" },
        { step: "Community Building", description: "Trust and engagement levels increase" }
      ],
      testimonial: {
        quote: "The AI chat feels so natural that attendees can't tell the difference. It creates amazing social proof and community energy.",
        author: "David Park",
        role: "Community Manager, EngageTech"
      }
    }
  },
  {
    icon: BarChart3,
    name: "InsightEngine™",
    benefit: "Crystal Clear Vision",
    description: "Deep insights that reveal exactly what drives your results with 90% accuracy predictions",
    category: "Analytics",
    color: "from-orange-500 to-amber-500",
    bgColor: "from-orange-500/10 to-amber-500/10",
    improvement: "90%+",
    metric: "Prediction Accuracy",
    modalContent: {
      videoUrl: "https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true",
      keyFeatures: [
        "Predictive Analytics Dashboard",
        "Behavioral Pattern Recognition",
        "Revenue Attribution Modeling",
        "Optimization Recommendations",
        "Real-time Performance Tracking"
      ],
      useCases: [
        "Predict webinar performance with 90% accuracy",
        "Identify top-performing content segments",
        "Optimize future webinar strategies",
        "Track ROI and attribution"
      ],
      metrics: [
        { label: "Prediction Accuracy", value: "92%", icon: Brain },
        { label: "Data Points Analyzed", value: "50M+", icon: BarChart3 },
        { label: "Optimization Lift", value: "40%", icon: TrendingUpIcon },
        { label: "Insight Generation", value: "Real-time", icon: Activity }
      ],
      workflow: [
        { step: "Data Collection", description: "Comprehensive tracking of all webinar interactions" },
        { step: "Pattern Analysis", description: "AI identifies behavioral patterns and trends" },
        { step: "Predictive Modeling", description: "System forecasts performance outcomes" },
        { step: "Recommendations", description: "Actionable insights for optimization" },
        { step: "Performance Tracking", description: "Real-time monitoring of results" }
      ],
      testimonial: {
        quote: "InsightEngine™ predicted our Q4 results within 3% accuracy. The optimization recommendations increased our ROI by 41%.",
        author: "Amanda Foster",
        role: "VP Analytics, DataDriven Inc"
      }
    }
  },
  {
    icon: Calendar,
    name: "SmartScheduler",
    benefit: "Worldwide Connection",
    description: "Intelligent time zone handling that finds optimal times for worldwide audiences",
    category: "Automation",
    color: "from-indigo-500 to-blue-500",
    bgColor: "from-indigo-500/10 to-blue-500/10",
    improvement: "Global",
    metric: "Time Optimization",
    modalContent: {
      videoUrl: "https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true",
      keyFeatures: [
        "Global Time Zone Intelligence",
        "Audience Preference Learning",
        "Optimal Time Recommendations",
        "Multi-Region Scheduling",
        "Attendance Prediction"
      ],
      useCases: [
        "Schedule webinars for global audiences",
        "Maximize attendance across time zones",
        "Automate optimal timing decisions",
        "Handle complex scheduling scenarios"
      ],
      metrics: [
        { label: "Global Reach", value: "24/7", icon: Globe },
        { label: "Time Zone Coverage", value: "All", icon: CalendarIcon },
        { label: "Scheduling Accuracy", value: "96%", icon: Target },
        { label: "Attendance Optimization", value: "+28%", icon: Users }
      ],
      workflow: [
        { step: "Audience Analysis", description: "System analyzes global audience distribution" },
        { step: "Preference Learning", description: "AI learns optimal times for each region" },
        { step: "Smart Recommendations", description: "System suggests best scheduling options" },
        { step: "Automated Scheduling", description: "Intelligent scheduling across time zones" },
        { step: "Maximized Attendance", description: "Optimal global participation achieved" }
      ],
      testimonial: {
        quote: "SmartScheduler helped us reach audiences in 47 countries with 28% higher attendance. It's like having a global scheduling genius.",
        author: "Carlos Mendez",
        role: "Global Marketing Director, WorldTech"
      }
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function FeatureShowcase() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFeature) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [selectedFeature]);

  return (
    <>
      <section
        id="features"
        className="bg-slate-900 py-24 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by AI
            </motion.div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Even More{" "}
              <span className="text-purple-400 lg:bg-gradient-to-r lg:from-purple-400 lg:to-blue-400 lg:bg-clip-text lg:text-transparent">
                ConvertCast
              </span>{" "}
              Features
            </h2>

            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover the complete suite of AI-powered tools that transform your webinars into revenue-generating machines.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {ecosystemFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                variants={cardVariants}
                className="group cursor-pointer"
                onClick={() => setSelectedFeature(feature.name)}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-full hover:border-slate-600/50 transition-all duration-500 group-hover:bg-slate-800/70">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>

                    <motion.div
                      className={`bg-gradient-to-r ${feature.color} px-3 py-1 rounded-full text-white text-sm font-bold shadow-md`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.improvement}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                          {feature.category}
                        </span>
                        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                        <span className="text-xs font-medium text-white/70">
                          {feature.metric}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 lg:group-hover:text-transparent lg:group-hover:bg-gradient-to-r lg:group-hover:from-purple-400 lg:group-hover:to-blue-400 lg:group-hover:bg-clip-text transition-all duration-300">
                        {feature.name}
                      </h3>

                      <p className="text-white/70 text-sm font-medium mb-3">
                        {feature.benefit}
                      </p>
                    </div>

                    <p className="text-white/80 leading-relaxed text-sm">
                      {feature.description}
                    </p>

                    <motion.div
                      className="flex items-center gap-2 text-purple-400 font-medium text-sm pt-2"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-4 h-4" />
                      <span>See It In Action</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Early Access to All Features
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const feature = ecosystemFeatures.find(f => f.name === selectedFeature);
                if (!feature) return null;

                return (
                  <>
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${feature.bgColor} border-b border-slate-700/50 p-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {feature.name}
                            </h3>
                            <p className="text-white/70">{feature.category} • {feature.benefit}</p>
                          </div>
                        </div>

                        <motion.button
                          onClick={() => setSelectedFeature(null)}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-6 h-6 text-white/70" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                      <div className="p-8 space-y-8">
                        {/* Video Demo */}
                        <motion.div
                          className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <iframe
                            src={feature.modalContent.videoUrl || "https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true"}
                            title={`${feature.name} Demo`}
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            className="w-full h-full"
                            style={{ border: "none" }}
                          />

                          {/* Overlay Elements similar to Hero */}
                          <div className="absolute top-4 right-4">
                            <motion.div
                              className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span>LIVE</span>
                            </motion.div>
                          </div>

                          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                            <div className="text-white text-sm font-medium">
                              {Math.floor(Math.random() * 300) + 150} watching
                            </div>
                          </div>

                          <div className="absolute bottom-4 right-4">
                            <div className={`bg-gradient-to-r ${feature.color} px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg`}>
                              {feature.name}
                            </div>
                          </div>
                        </motion.div>

                        {/* Key Features */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            Key Features
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {feature.modalContent.keyFeatures.map((keyFeature, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                              >
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-white/90 text-sm">{keyFeature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            Performance Metrics
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {feature.modalContent.metrics.map((metric, index) => (
                              <motion.div
                                key={index}
                                className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                              >
                                <metric.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                                <div className="text-white/70 text-xs">{metric.label}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* How It Works */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Workflow className="w-5 h-5 text-emerald-400" />
                            How It Works
                          </h4>
                          <div className="space-y-4">
                            {feature.modalContent.workflow.map((step, index) => (
                              <motion.div
                                key={index}
                                className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                              >
                                <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <h5 className="font-semibold text-white mb-1">{step.step}</h5>
                                  <p className="text-white/70 text-sm">{step.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Use Cases */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-orange-400" />
                            Use Cases
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {feature.modalContent.useCases.map((useCase, index) => (
                              <motion.div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                              >
                                <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span className="text-white/90 text-sm">{useCase}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial */}
                        {feature.modalContent.testimonial && (
                          <motion.div
                            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <blockquote className="text-white/90 italic mb-3">
                                  "{feature.modalContent.testimonial.quote}"
                                </blockquote>
                                <div className="text-white/70">
                                  <div className="font-semibold">{feature.modalContent.testimonial.author}</div>
                                  <div className="text-sm">{feature.modalContent.testimonial.role}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Call to Action */}
                        <div className="text-center pt-6">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="lg"
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg"
                            >
                              Request Early Access to {feature.name}
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}