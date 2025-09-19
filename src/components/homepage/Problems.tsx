"use client";

import { UserCheck, Zap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: UserCheck,
    problem: "Declining Attendance Rates",
    solution: "ShowUp Surge™",
    category: "Attendance Optimization",
    description: "You spend the time, money, and effort to register people for your webinars - but they don't show up! That's wasted money and time. With ConvertCast's ShowUp Surge™ feature we increase showup rate to over 50%",
    improvement: "50%+",
    color: "from-emerald-500 to-green-500"
  },
  {
    icon: Zap,
    problem: "Low Engagement & Energy",
    solution: "EngageMax™",
    category: "Engagement Engine",
    description: "Then we unleash EngageMax™, a real-time audience activation system featuring interactive pop-up CTAs, on-screen emoji reactions, gamified polls, and adaptive engagement scripts that react dynamically to audience behavior.",
    improvement: "70%+",
    color: "from-purple-500 to-violet-500"
  },
  {
    icon: TrendingUp,
    problem: "Poor Conversion Rates",
    solution: "AutoOffer™",
    category: "Conversion Accelerator",
    description: "Instead of sending your user to another page to take action - we let users checkout, schedule appointments, all from the same live stream. Through our AutoOffer™ technology we reduce buying friction immediately.",
    improvement: "50%+",
    color: "from-blue-500 to-cyan-500"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9
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

export function Problems() {
  return (
    <section
      id="problems"
      className="bg-slate-900 py-24 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
            className="inline-flex items-center px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            The 3 Critical Problems
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            We Fix The Problems{" "}
            <span className="text-red-400 lg:bg-gradient-to-r lg:from-red-400 lg:to-pink-400 lg:bg-clip-text lg:text-transparent">
              ALL Webinars
            </span>{" "}
            Suffer From
          </h2>

          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Three critical problems. Three proprietary solutions. One unified platform that transforms your webinar strategy into a predictable revenue engine.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden h-full hover:border-slate-600/50 transition-all duration-500"
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Problem Header */}
                <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-b border-red-500/20 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </motion.div>
                    <div>
                      <div className="text-red-400 text-xs font-medium uppercase tracking-wider">
                        Problem #{index + 1}
                      </div>
                      <h3 className="text-white font-semibold">
                        {problem.problem}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Solution Section */}
                <div className="p-6">
                  <motion.div
                    className={`bg-gradient-to-r ${problem.color} bg-opacity-10 border border-white/10 rounded-xl p-4 mb-6`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${problem.color} rounded-lg flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <problem.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">
                          {problem.solution}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {problem.category}
                        </p>
                      </div>
                      <motion.div
                        className={`bg-gradient-to-r ${problem.color} px-3 py-1 rounded-full text-white text-sm font-bold`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {problem.improvement}
                      </motion.div>
                    </div>
                  </motion.div>

                  <p className="text-white/80 leading-relaxed text-sm">
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Summary */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-xl max-w-4xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Transformation
            </motion.div>

            <h3 className="text-3xl font-bold text-white mb-6">
              The Result: Your Webinars Become{" "}
              <span className="text-emerald-400 lg:bg-gradient-to-r lg:from-emerald-400 lg:to-blue-400 lg:bg-clip-text lg:text-transparent">
                Revenue Engines
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { value: "50%+", label: "Higher Attendance", color: "text-emerald-400" },
                { value: "70%+", label: "More Engagement", color: "text-purple-400" },
                { value: "50%+", label: "Better Conversions", color: "text-blue-400" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <p className="text-white/80 leading-relaxed">
              When all three systems work together, you don't just fix problems - you{" "}
              <span className="text-white font-semibold">
                transform your entire webinar strategy
              </span>{" "}
              into a predictable, scalable revenue engine.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}