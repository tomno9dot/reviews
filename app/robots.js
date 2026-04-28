// app/robots.js

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
    'https://yoursite.com';

  return {
    rules: {
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
    sitemap: baseUrl + '/sitemap.xml',
  };
}