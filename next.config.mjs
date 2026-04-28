// next.config.mjs  ← YOUR FILE (keep as .mjs)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Remove experimental middleware if you have it
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },

  // ✅ Fix for Windows path issues
  // ✅ Suppress specific warnings
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;