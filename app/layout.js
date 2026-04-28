// review-saas/app/layout.jsx

import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ||
  'https://reviewboost.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ReviewBoost - Get More Google Reviews Automatically',
    template: '%s | ReviewBoost',
  },
  description:
    'Automatically send Google review requests to your customers ' +
    'after every visit. Get 3x more reviews in 30 days. ' +
    'Perfect for restaurants, salons, clinics and local businesses worldwide. ' +
    'Free 14-day trial. No credit card required.',
  keywords: [
    'google reviews',
    'get more google reviews',
    'google review automation',
    'review management software',
    'review request software',
    'customer review tool',
    'restaurant reviews',
    'salon reviews',
    'clinic reviews',
    'local business reviews',
    'increase google reviews',
    'google my business reviews',
    'review management system',
    'automated review requests',
    'review boost',
    'more google reviews',
    'review generation software',
    'small business reviews',
  ],
  authors: [{ name: 'ReviewBoost' }],
  creator: 'ReviewBoost',
  publisher: 'ReviewBoost',
  category: 'Business Software',
  classification: 'Review Management',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: [
      'en_GB',
      'en_NG',
      'en_GH',
      'en_KE',
      'en_ZA',
    ],
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
        alt: 'ReviewBoost - Get More Google Reviews Automatically',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@reviewboostapp',
    creator: '@reviewboostapp',
    title: 'ReviewBoost - Get More Google Reviews',
    description:
      'Automate your Google review requests. ' +
      '3x more reviews in 30 days. Try free!',
    images: [siteUrl + '/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-code',
    bing: 'your-bing-code',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': siteUrl,
      'en-GB': siteUrl + '/uk',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7c3aed" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}