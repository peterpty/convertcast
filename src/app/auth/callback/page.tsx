"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, XCircle, Play } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setStatus('error');
          return;
        }

        if (data.session) {
          setStatus('success');

          // Small delay for better UX
          setTimeout(() => {
            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
            router.push(redirectTo);
          }, 1500);
        } else {
          setError('No session found');
          setStatus('error');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router]);

  const handleRetry = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-6 max-w-md mx-auto px-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Play className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">ConvertCast</span>
        </div>

        {/* Status Display */}
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Completing Sign In...
              </h2>
              <p className="text-white/70">
                Please wait while we redirect you to your dashboard.
              </p>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Sign In Successful!
              </h2>
              <p className="text-white/70">
                Welcome to ConvertCast. Redirecting to your dashboard...
              </p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Sign In Failed
              </h2>
              <p className="text-white/70 mb-4">
                {error || 'An error occurred during authentication.'}
              </p>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}