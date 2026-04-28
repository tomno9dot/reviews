// app/layout.jsx

import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ||
  'https://yoursite.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ReviewBoost - Get More Google Reviews Automatically',
    template: '%s | ReviewBoost',
  },
  description:
    'Automatically send Google review requests to your customers. ' +
    'Get 3x more reviews in 30 days. Perfect for restaurants, salons, ' +
    'clinics and local businesses in Nigeria.',
  keywords: [
    'google reviews nigeria',
    'get more google reviews',
    'review management nigeria',
    'customer review software',
    'restaurant reviews nigeria',
    'salon reviews',
    'google my business nigeria',
    'review automation',
    'local business reviews',
    'increase google reviews',
  ],
  authors: [{ name: 'ReviewBoost' }],
  creator: 'ReviewBoost',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteUrl,
    siteName: 'ReviewBoost',
    title: 'ReviewBoost - Get More Google Reviews Automatically',
    description:
      'Send automatic review requests to customers. ' +
      'Get 3x more Google reviews in 30 days. Free trial!',
    images: [
      {
        url: siteUrl + '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReviewBoost - Get More Google Reviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReviewBoost - Get More Google Reviews',
    description: 'Automate your Google review requests. Try free!',
    images: [siteUrl + '/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}