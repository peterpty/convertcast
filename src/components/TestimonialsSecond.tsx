"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";

const stats = [
  { number: "10x", label: "Revenue Increase", color: "from-emerald-500 to-green-500" },
  { number: "98%", label: "Attendance Rate", color: "from-blue-500 to-cyan-500" },
  { number: "67%", label: "Conversion Rate", color: "from-purple-500 to-violet-500" },
  { number: "15min", label: "Setup Time", color: "from-orange-500 to-red-500" }
];

export function TestimonialsSecond() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            <span className="text-white/90">Proven </span>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Results
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join thousands of successful businesses using ConvertCast
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.number}
              </div>
              <div className="text-white/70 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <blockquote className="text-2xl lg:text-3xl text-white/90 italic mb-8 max-w-4xl mx-auto">
            "ConvertCast didn't just improve our webinars - it completely transformed our business model.
            We're now generating 10x more revenue per event."
          </blockquote>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              J
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">James Miller</div>
              <div className="text-white/60">CEO, DigitalCourse Pro</div>
            </div>
            <div className="flex ml-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}