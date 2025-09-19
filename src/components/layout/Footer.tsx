"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Demo", href: "/demo" },
      { label: "Integrations", href: "/integrations" },
      { label: "Templates", href: "/templates" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/auth/login" },
      { label: "Request Invite", href: "/auth/signup", special: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="mb-6 block">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-white">ConvertCast</span>
                  </div>
                </Link>
              </motion.div>

              <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                ConvertCast is the AI Webinar platform that takes the stress out of selling live. Transform your webinars into revenue-generating machines.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.div
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 4 }}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hello@convertcast.ai</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 4 }}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">1-800-CONVERT</span>
                </motion.div>
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section, index) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-white font-semibold text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: linkIndex * 0.1 }}
                    >
                      {link.special ? (
                        <motion.div
                          whileHover={{ x: 4, scale: 1.05 }}
                        >
                          <Link
                            href={link.href}
                            className="text-slate-400 hover:text-white transition-colors duration-300 relative group flex items-center gap-2"
                          >
                            {link.label}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={link.href}
                            className="text-slate-400 hover:text-white transition-colors duration-300 relative group"
                          >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                        </motion.div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-800/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/privacy"
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-300 relative group"
                  >
                    Privacy Policy
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/terms"
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-300 relative group"
                  >
                    Terms of Service
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              </div>

              {/* Copyright */}
              <div className="text-slate-500 text-sm text-center md:text-right">
                © 2025 ConvertCast. All rights reserved.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}