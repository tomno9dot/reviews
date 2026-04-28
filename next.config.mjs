// review-saas/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {

  // ✅ Allow ngrok domain
  allowedDevOrigins: [
    'bloating-jarring-yanking.ngrok-free.dev',
    '*.ngrok-free.dev',
    '*.ngrok-free.app',
    '*.ngrok.io',
  ],

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, ngrok-skip-browser-warning',
          },
        ],
      },
    ];
  },
};

export default nextConfig;