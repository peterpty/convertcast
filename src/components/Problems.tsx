"use client";

import { Users, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export function Problems() {
  return (
    <section id="problems" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            We Fix The Problems <span className="text-red-400">ALL</span> Webinars Suffer From
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            These critical problems: Poor marketing solutions, that marketers perform that transform your
            webinar into a predictable business system.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Declining Attendance Rates",
              subtitle: "People don't show up",
              description: "You spend the time, money, and effort to register people for your webinars - but they don't show up! That's wasted money and time.",
              color: "border-red-500/30",
              bgColor: "bg-red-500/10",
              textColor: "text-red-400"
            },
            {
              title: "Low Engagement & Energy",
              subtitle: "People don't interact",
              description: "Standard webinar platforms are boring! Your audience zones out, stops paying attention, and definitely doesn't buy.",
              color: "border-purple-500/30",
              bgColor: "bg-purple-500/10",
              textColor: "text-purple-400"
            },
            {
              title: "Poor Conversion Rates",
              subtitle: "People don't purchase",
              description: "At the end of your webinar, you make your pitch... and crickets. People leave without buying anything.",
              color: "border-blue-500/30",
              bgColor: "bg-blue-500/10",
              textColor: "text-blue-400"
            }
          ].map((problem, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl border ${problem.color} ${problem.bgColor} backdrop-blur-sm`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`text-sm ${problem.textColor} font-medium mb-2`}>
                {problem.subtitle}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {problem.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Solutions */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: "ShowUp Surge™",
              description: "Send hyper-personalized messages that boost webinar attendance to 80%+",
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-500"
            },
            {
              icon: Zap,
              title: "EngageMax™",
              description: "Real-time AI responds to chat, keeps energy high, and drives action",
              color: "from-purple-500 to-violet-500",
              bgColor: "bg-purple-500"
            },
            {
              icon: TrendingUp,
              title: "AutoOffer™",
              description: "Smart AI presents irresistible offers at the perfect moment for maximum sales",
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-500"
            }
          ].map((solution, index) => (
            <motion.div
              key={index}
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-6 hover:border-slate-700/50 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
            >
              <div className={`w-12 h-12 rounded-lg ${solution.bgColor} flex items-center justify-center mb-4`}>
                <solution.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold bg-gradient-to-r ${solution.color} bg-clip-text text-transparent mb-3`}>
                {solution.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {solution.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}