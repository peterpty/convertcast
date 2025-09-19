"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { Problems } from "@/components/homepage/Problems";
import { FeatureShowcase } from "@/components/homepage/FeatureShowcase";
import { Testimonials } from "@/components/homepage/Testimonials";
import { TestimonialsSecond } from "@/components/homepage/TestimonialsSecond";

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header />

      {/* Add padding-top to account for fixed header */}
      <main className="pt-16">
        <Hero />
        <Problems />
        <Testimonials />
        <FeatureShowcase />
        <TestimonialsSecond />
      </main>

      <Footer />
    </motion.div>
  );
}