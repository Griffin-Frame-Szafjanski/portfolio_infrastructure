/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization (can enable later with Vercel's image optimization)
  images: {
    unoptimized: true,
  },
  
  // Enable React strict mode
  reactStrictMode: true,
}

module.exports = nextConfig
