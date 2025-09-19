"use client";

import { Star, Target, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Testimonials() {
  return (
    <section className="bg-slate-900 py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Testimonial Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            From <span className="text-red-400">$5K on Zoom</span> to{" "}
            <span className="text-emerald-400">$45K with ConvertCast</span>
          </h2>

          <motion.div
            className="inline-block bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-6 mb-12"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-6xl lg:text-7xl font-bold text-emerald-400 mb-2">900% ROI</div>
            <div className="text-emerald-300 text-lg">Revenue Increase</div>
          </motion.div>
        </motion.div>

        {/* Rebecca Testimonial */}
        <motion.div
          className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-3xl border border-slate-600/50 overflow-hidden mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-teal-600/20 p-8">
            <div className="flex items-center space-x-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-400">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">RT</span>
                </div>
              </div>
              <div>
                <motion.div
                  className="inline-flex items-center px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-2"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Target className="w-4 h-4 mr-1" />
                  $45K
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Meet Rebecca T.Y.</h3>
                <p className="text-slate-300">Founder of RTY Art Academy</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <blockquote className="mt-6 text-xl text-slate-200 leading-relaxed">
              "ConvertCast transformed our business from struggling to break even to generating $800K+ in 12 months."
            </blockquote>
          </div>

          {/* Problem Section */}
          <motion.div
            className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-b border-red-500/20 p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-400 font-bold">1</span>
              </div>
              <h4 className="text-xl font-bold text-red-400">The Problem</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              "We were running webinars on Zoom with only a{" "}
              <span className="text-red-400 font-semibold">20% show-up rate</span> and converting just{" "}
              <span className="text-red-400 font-semibold">1% of attendees</span>. Every launch barely broke even. The 'gurus' told us our offer was the problem — that no one would pay $2,000 for a course on painting."
            </p>
          </motion.div>

          {/* Solution Section */}
          <motion.div
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/20 p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <h4 className="text-xl font-bold text-purple-400">ConvertCast Solution</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              "ConvertCast completely changed the game. The{" "}
              <span className="text-purple-400 font-semibold">AI-powered reminder sequences</span> got people to show up.{" "}
              <span className="text-purple-400 font-semibold">EngageMax™</span> kept them engaged with interactive polls and real-time chat. The real-time purchase alerts drove a buying frenzy — we hit{" "}
              <span className="text-purple-400 font-semibold">$45K in sales with the SAME OFFER</span>."
            </p>
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 p-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-emerald-400 font-bold">3</span>
              </div>
              <h4 className="text-xl font-bold text-emerald-400">The Results</h4>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center bg-slate-800/30 rounded-xl p-4">
                <div className="text-4xl font-bold text-emerald-400 mb-1">65%</div>
                <div className="text-slate-300 text-sm">Show-up Rate</div>
                <div className="text-slate-500 text-xs">↑ from 20%</div>
              </div>
              <div className="text-center bg-slate-800/30 rounded-xl p-4">
                <div className="text-4xl font-bold text-purple-400 mb-1">900%</div>
                <div className="text-slate-300 text-sm">Conversion Increase</div>
                <div className="text-slate-500 text-xs">$45K single webinar</div>
              </div>
              <div className="text-center bg-slate-800/30 rounded-xl p-4">
                <div className="text-4xl font-bold text-blue-400 mb-1">$800K+</div>
                <div className="text-slate-300 text-sm">Revenue Generated</div>
                <div className="text-slate-500 text-xs">in 12 months</div>
              </div>
            </div>

            <blockquote className="text-slate-300 leading-relaxed text-center">
              "ConvertCast didn't just improve our webinars - it transformed our entire business model.{" "}
              <span className="text-emerald-400 font-semibold">
                It's now the most important piece of software in our business
              </span>.{" "}
              Without it, we would go bankrupt."
            </blockquote>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Webinar Results?
          </h3>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Request an Invite
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}