/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for standalone deployment
  output: 'standalone',
  
  // Disable image optimization for Cloudflare compatibility
  images: {
    unoptimized: true,
  },
  
  // Remove trailing slashes (can cause issues with Workers)
  trailingSlash: false,
  
  // Base path (leave empty for root deployment)
  basePath: '',
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Ensure static assets are properly generated
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
