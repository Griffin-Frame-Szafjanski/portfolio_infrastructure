/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization (can enable later with Vercel's image optimization)
  images: {
    unoptimized: true,
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Increase body size limit for API routes (for file uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  
  // Security headers (additional to middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
        ],
      },
    ];
  },
  
  // Compress responses
  compress: true,
  
  // Power header off
  poweredByHeader: false,
}

module.exports = nextConfig
