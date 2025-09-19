"use client";

import { Star, Quote, ArrowRight, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Steady Horse Noah",
    title: "Virtual Horse Trainer",
    company: "",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fb8ab7eab51514bb59b560f9290a4ad1f%2F75110ae7126740eda631b198446b4592?format=webp",
    quote: "ConvertCast helped me launch my virtual horse training business. After using it only twice I was booked out for the year!",
    results: [
      { metric: "78%", label: "Stayed Until Offer", color: "text-blue-400" },
      { metric: "40%", label: "Conversion Rate", color: "text-purple-400" },
      { metric: "$177K", label: "Single Launch", color: "text-emerald-400" },
    ],
  },
  {
    name: "Kathryn Aragon",
    title: "Business Coach",
    company: "",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fb8ab7eab51514bb59b560f9290a4ad1f%2Fb604f86572ca42ee81dd581b2533f708",
    quote: "I'm someone who hates hard selling. With ConvertCast I just state my offer and let the software do the work!",
    results: [
      { metric: "2,400%", label: "Attendance Growth", color: "text-emerald-400" },
      { metric: "89%", label: "Engagement Rate", color: "text-purple-400" },
      { metric: "25", label: "Appointments Booked Per Month", color: "text-orange-400" },
    ],
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

export function TestimonialsSecond() {
  return (
    <section className="bg-slate-900 py-24 relative overflow-hidden">
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
            <Users className="w-4 h-4 mr-2" />
            Client Success Stories
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Real{" "}
            <span className="text-purple-400 lg:bg-gradient-to-r lg:from-purple-400 lg:to-blue-400 lg:bg-clip-text lg:text-transparent">
              Success Stories
            </span>
          </h2>

          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            See how entrepreneurs, coaches, course creators, & service providers are transforming their businesses with ConvertCast
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group"
            >
              <motion.div
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 h-full hover:border-slate-600/50 transition-all duration-500"
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Quote Header */}
                <div className="flex justify-between items-start mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Quote className="w-8 h-8 text-purple-400/60 group-hover:text-purple-400 transition-colors" />
                  </motion.div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: 0.1 * i }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-slate-200 text-lg leading-relaxed mb-8 font-medium">
                  "{testimonial.quote}"
                </blockquote>

                {/* Results Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  {testimonial.results.map((result, idx) => (
                    <motion.div
                      key={idx}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`text-2xl lg:text-3xl font-bold ${result.color} mb-1`}>
                        {result.metric}
                      </div>
                      <div className="text-slate-400 text-sm font-medium">
                        {result.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Profile */}
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/50"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-purple-300 font-medium">
                      {testimonial.title}
                    </p>
                    {testimonial.company && (
                      <p className="text-slate-400 text-sm">
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closed Beta CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Target className="w-4 h-4 mr-2" />
              Limited Access
            </motion.div>

            <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              ConvertCast is in{" "}
              <span className="text-blue-400 lg:bg-gradient-to-r lg:from-blue-400 lg:to-purple-400 lg:bg-clip-text lg:text-transparent">
                Closed Beta
              </span>
            </h3>

            <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              We're currently partnering with a select group of online marketers to refine ConvertCast and perfect its features before opening to the public.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Request an Invite
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}