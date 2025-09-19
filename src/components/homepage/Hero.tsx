"use client";

import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function RotatingText() {
  return (
    <motion.span
      className="relative inline-block min-w-[200px] h-[1.2em] whitespace-nowrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <span className="text-blue-400 relative inline-block min-w-[200px] h-[1.2em] whitespace-nowrap">
        <span className="absolute inset-0 opacity-0 rotating-text-1 transform-gpu">
          new clients
        </span>
        <span className="absolute inset-0 opacity-0 rotating-text-2 transform-gpu">
          booked calls
        </span>
        <span className="absolute inset-0 opacity-0 rotating-text-3 transform-gpu">
          course sales
        </span>
        <span className="invisible">new clients</span>
      </span>
    </motion.span>
  );
}

export function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Content Section */}
          <motion.div
            className="text-center lg:text-left mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-white/90 text-sm mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              AI-Powered Webinar Platform
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-7xl font-bold text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                fontOpticalSizing: 'auto',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              <span className="text-purple-400 lg:bg-gradient-to-r lg:from-purple-400 lg:via-blue-400 lg:to-purple-400 lg:bg-clip-text lg:text-transparent">
                ConvertCast
              </span>
              <br />
              <span className="text-white/90">takes the stress out of </span><span className="text-blue-400 lg:bg-gradient-to-r lg:from-blue-400 lg:to-purple-400 lg:bg-clip-text lg:text-transparent whitespace-nowrap">selling live</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              Stop leaving money on the table with basic webinar tools. ConvertCast's AI-powered platform converts{" "}
              <span className="text-blue-400 font-semibold">50% better</span> than traditional solutions.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/auth/signup">
                    Request an Invite
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white/90 hover:bg-white/10 hover:text-white px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                { number: "50%", label: "Higher Conversion" },
                { number: "98%", label: "Attendance Rate" },
                { number: "15min", label: "Setup Time" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Video Demo Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
              {/* Header */}
              <motion.div
                className="flex items-center justify-between mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How to 10x Your Sales</h3>
                    <p className="text-white/70 text-sm">Live AI Webinar</p>
                  </div>
                </div>
                <motion.div
                  className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </motion.div>
              </motion.div>

              {/* Video Container */}
              <motion.div
                className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <iframe
                  src="https://fast.wistia.net/embed/iframe/9xhewqwxy9?seo=false&videoFoam=true"
                  title="ConvertCast Demo"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ border: "none" }}
                />

                {/* Overlay Elements */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="text-white text-sm font-medium">234 watching</div>
                </div>
              </motion.div>

              {/* Chat Preview */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                {[
                  { name: "Sarah M.", message: "This is exactly what I needed! 🔥", delay: 0 },
                  { name: "Mike R.", message: "Amazing conversion tips!", delay: 0.2 },
                  { name: "Lisa K.", message: "When is the next session?", delay: 0.4 }
                ].map((chat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + chat.delay, duration: 0.4 }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex-shrink-0"></div>
                    <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-sm text-white/80">
                      <span className="font-medium text-white">{chat.name}</span> {chat.message}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              98% attendance rate
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              AI-Powered Insights
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}