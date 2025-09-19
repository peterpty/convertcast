"use client";

import { motion } from "framer-motion";
import { Star, Play, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

export function CaseStudy() {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            From <span className="text-red-400">$5K on Zoom</span> to{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              $45K with ConvertCast
            </span>
          </h2>
          <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            900% ROI
          </div>
        </motion.div>

        <motion.div
          className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-8 lg:p-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
              R
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Meet Rebecca T.V.</h3>
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/70">
                Marketing consultant who became overwhelmed by lead generation with a $5000 monthly
                problem until she found ConvertCast.
              </p>
            </div>
          </div>

          {/* The Problem */}
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <h4 className="text-lg font-bold text-red-400">The Problem</h4>
            </div>
            <p className="text-white/80">
              Rebecca was struggling with the same marketing challenges that every consultant faces: hard
              generating leads, manually posting social media campaigns, and working with hard-to-land
              deals.
            </p>
          </div>

          {/* ConvertCast Features */}
          <div className="mb-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
            <div className="flex items-center mb-3">
              <Play className="w-5 h-5 text-purple-400 mr-2" />
              <h4 className="text-lg font-bold text-purple-400">ConvertCast Features</h4>
            </div>
            <p className="text-white/80">
              ConvertCast integrates with your CRM. You can host webinars that directly track to lead
              management. We use SMTP configuration that tracks marketing message campaigns and
              integrates with your favorite sales funnel.
            </p>
          </div>

          {/* The Results */}
          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="text-lg font-bold text-green-400">The Results</h4>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-4">
              {[
                { label: "40%", subtitle: "More Attendees" },
                { label: "300%", subtitle: "Higher Engagement" },
                { label: "1,500+", subtitle: "Leads Generated" }
              ].map((result, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {result.label}
                  </div>
                  <div className="text-white/70 text-sm">
                    {result.subtitle}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white/80">
              Compared with her Zoom webinars, ConvertCast has systematically improved her business with
              machine support for customer call management.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <h4 className="text-xl font-bold text-white mb-4">
              Ready to Transform Your Webinar Results?
            </h4>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg shadow-lg">
              Request an Invite
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}