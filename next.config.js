/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // Add any other domains you need
  },
  experimental: {
    serverActions: {}, // ✅ must be an object, not a boolean
  },
}

module.exports = nextConfig;
