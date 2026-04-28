// review-saas/app/robots.js

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
    'https://reviewboost.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/customers',
          '/analytics',
          '/settings',
          '/api/',
        ],
      },
    ],
    sitemap: baseUrl + '/sitemap.xml',
    host: baseUrl,
  };
}