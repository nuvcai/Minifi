/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // TODO: Enable in CI/CD pipeline or local builds on non-iCloud paths
    // Current path has spaces which causes module resolution issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TODO: Enable in CI/CD pipeline or local builds on non-iCloud paths
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for production
    unoptimized: process.env.NODE_ENV === 'development',
    // Add allowed domains for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

export default nextConfig
