"use client";

import { Button } from "./ui/button";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
                ConvertCast
              </span>
              <br />
              <span className="text-white">takes the stress</span>
              <br />
              <span className="text-white">out of </span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">selling live</span>
            </motion.h1>

            <motion.p
              className="text-lg text-white/80 leading-relaxed max-w-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Stop beating around the bush with basic webinar tools. ConvertCast optimizes every touch-point that make your revenue engine.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-base rounded-lg shadow-lg">
                Request an Invite
              </Button>

              <Button
                variant="outline"
                className="border-white/40 text-white/90 hover:bg-white/10 hover:text-white px-8 py-3 text-base rounded-lg backdrop-blur-sm"
              >
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                { number: "50%", label: "Higher Conversion", color: "text-purple-400" },
                { number: "98%", label: "Attendance Rate", color: "text-blue-400" },
                { number: "15min", label: "Setup Time", color: "text-cyan-400" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
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
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white/60 text-sm ml-4">How To 10x Your Sales</span>
                </div>
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Join Webinar</span>
                </div>
              </div>

              {/* Video Container with Play Button */}
              <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
                <Button
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 border-2 border-white/30"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </Button>

                {/* Viewer count */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="text-white text-sm font-medium">834 watching</div>
                </div>
              </div>

              {/* Chat Preview */}
              <div className="space-y-2">
                {[
                  { name: "Samantha K.", message: "This is exactly what I needed for my course launch! 🔥", time: "2m ago" },
                  { name: "Mike Chen", message: "Just implemented this strategy - already seeing 40% better conversions", time: "3m ago" },
                  { name: "Lisa Rodriguez", message: "When will the recording be available?", time: "5m ago" }
                ].map((chat, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-[10px]">
                      {chat.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-white/90 font-medium">{chat.name}</div>
                      <div className="text-white/70">{chat.message}</div>
                    </div>
                    <div className="text-white/50 text-[10px]">{chat.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}