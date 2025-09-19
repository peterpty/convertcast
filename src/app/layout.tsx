import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConvertCast - High-Converting Live Streaming Platform',
  description: 'Transform your live events into sales experiences with ConvertCast - the ultimate streaming platform for coaches, marketers, and course creators.',
  keywords: ['live streaming', 'webinars', 'sales', 'marketing', 'conversion optimization'],
  authors: [{ name: 'ConvertCast Team' }],
  creator: 'ConvertCast',
  publisher: 'ConvertCast',
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'ConvertCast - High-Converting Live Streaming Platform',
    description: 'Transform your live events into sales experiences',
    siteName: 'ConvertCast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvertCast - High-Converting Live Streaming Platform',
    description: 'Transform your live events into sales experiences',
    creator: '@convertcast',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}