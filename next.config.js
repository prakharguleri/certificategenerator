/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // Add any other domains you need
  },
  experimental: {
    serverActions: true, // If using Next.js server actions
  },
}

module.exports = nextConfig