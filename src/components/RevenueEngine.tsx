"use client";

import { motion } from "framer-motion";

export function RevenueEngine() {
  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-8">
            The Result: Your Webinars Become{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Revenue Engines
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              {
                number: "50%+",
                label: "Average attendance rate",
                description: "When done properly, everything to premium advertising and professional copywriting."
              },
              {
                number: "98%",
                label: "Watch rate completion",
                description: "Your content gets consumed and your audience stays with you until the offer."
              },
              {
                number: "$50k",
                label: "In a single webinar",
                description: "Our top customers are getting 5x their conversion rates vs traditional webinars."
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-white mb-3">
                  {stat.label}
                </div>
                <div className="text-sm text-white/70 leading-relaxed">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}