'use client';

import { useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthErrorBoundary } from '@/components/ErrorBoundary';
// Temporarily disable SocketProvider to avoid connection issues
// import { SocketProvider } from '@/hooks/useSocket';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AuthErrorBoundary>
  );
}