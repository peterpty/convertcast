"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Mail,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Add resend logic here
    setTimeout(() => setIsResending(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"
            >
              <Play className="h-4 w-4 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white">ConvertCast</span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-white/70">Already verified?</span>
            <Button asChild variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 h-16 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-white/70">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">What's next?</h3>
                    <ul className="text-xs text-white/70 space-y-1">
                      <li>• Check your email inbox (and spam folder)</li>
                      <li>• Click the verification link in the email</li>
                      <li>• Return here to access your dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-white/60 text-sm">
                  Didn't receive the email?
                </p>
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline"
                  className="w-full border-slate-600 text-white hover:bg-slate-800"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </Button>
              </div>

              <div className="text-center pt-4 border-t border-slate-600">
                <p className="text-white/70 text-sm">
                  Need help?{" "}
                  <Link
                    href="/support"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link href="/auth/login">
                Continue to Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}