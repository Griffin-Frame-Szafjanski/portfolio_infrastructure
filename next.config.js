/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for Cloudflare Pages compatibility
  images: {
    unoptimized: true,
  },
  
  // Trailing slashes for better compatibility
  trailingSlash: true,
  
  // Base path (leave empty for root deployment)
  basePath: '',
  
  // Enable React strict mode
  reactStrictMode: true,
}

module.exports = nextConfig
