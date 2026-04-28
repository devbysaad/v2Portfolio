/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.githubusercontent.com' },
    ],
  },
  experimental: {
    serverActions: {
      // Allow localhost + any Vercel or custom domain
      allowedOrigins: [
        'localhost:3000',
        'v2portfolio.vercel.app',
        '*.vercel.app',
      ].filter(Boolean),
    },
  },
}

module.exports = nextConfig
