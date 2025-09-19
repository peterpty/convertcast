"use client";

import { motion } from "framer-motion";
import { Zap, Users, BarChart3, Brain, MessageSquare, Shield } from "lucide-react";
import { Button } from "./ui/button";

export function FeatureShowcase() {
  return (
    <section id="features" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Even More <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ConvertCast</span> Features
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
            Discover all the compelling tools and AI-powered tools that transform your webinars into
            revenue-generating machines.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Users,
              title: "ShowUp Surge™",
              subtitle: "NEW",
              description: "Hyper-personalized email sequences that boost webinar attendance rates to 80%+. No more empty webinars.",
              color: "from-green-500 to-emerald-500",
              badgeColor: "bg-green-500"
            },
            {
              icon: Zap,
              title: "EngageMax™",
              subtitle: "NEW",
              description: "Real-time AI that responds to chat, keeps energy high, and drives action throughout your entire presentation.",
              color: "from-purple-500 to-violet-500",
              badgeColor: "bg-purple-500"
            },
            {
              icon: BarChart3,
              title: "AutoOffer™",
              subtitle: "NEW",
              description: "Smart AI presents irresistible offers at the perfect psychological moment for maximum conversions and sales.",
              color: "from-blue-500 to-cyan-500",
              badgeColor: "bg-blue-500"
            },
            {
              icon: Brain,
              title: "AudienceAI™",
              subtitle: "PRO",
              description: "Advanced audience segmentation and behavioral analysis that predicts the best content for each viewer type.",
              color: "from-orange-500 to-red-500",
              badgeColor: "bg-orange-500"
            },
            {
              icon: MessageSquare,
              title: "ChatBoost™",
              subtitle: "PRO",
              description: "Intelligent chat moderation and engagement tools that keep conversations flowing and on-topic.",
              color: "from-pink-500 to-rose-500",
              badgeColor: "bg-pink-500"
            },
            {
              icon: Shield,
              title: "SecureStream™",
              subtitle: "PRO",
              description: "Enterprise-grade security with encrypted streams, secure payment processing, and data protection.",
              color: "from-indigo-500 to-purple-500",
              badgeColor: "bg-indigo-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-6 hover:border-slate-700/50 transition-all duration-500 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${feature.badgeColor} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${feature.badgeColor} text-white font-medium`}>
                  {feature.subtitle}
                </span>
              </div>

              <h3 className={`text-xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-3`}>
                {feature.title}
              </h3>

              <p className="text-white/70 text-sm leading-relaxed">
                {feature.description}
              </p>

              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg shadow-lg">
            See Our Pricing & Features
          </Button>
        </motion.div>
      </div>
    </section>
  );
}