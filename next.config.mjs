/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses (gzip/brotli) in prod
  compress: true,

  // Serve images at optimal formats (WebP → AVIF)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Tree-shake heavy packages (framer-motion, lucide, recharts)
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'recharts',
    ],
  },

  // Aggressive cache headers for static assets
  async headers() {
    return [
      {
        // JS/CSS bundles — immutable (hash in filename)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Public images/fonts in /public
        source: '/(.*).(jpg|jpeg|gif|png|svg|ico|webp|avif|woff|woff2|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // PDFs — permitir embed desde el mismo origen (modal iframe)
        source: '/:path*.pdf',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Disposition', value: 'inline' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
      {
        // Security headers on all pages (PDFs handled above)
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
