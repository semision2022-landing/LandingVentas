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
    const csp = [
      "default-src 'self'",
      // Next.js inline scripts + Google Tag Manager + Facebook Pixel
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net",
      // Google Analytics, Ads, DoubleClick, Facebook, Supabase (REST + realtime WS)
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.com.co https://connect.facebook.net https://www.facebook.com https://*.supabase.co wss://*.supabase.co",
      // Píxeles de seguimiento (Google, Facebook)
      "img-src 'self' data: blob: https://www.google.com https://www.google.com.co https://www.googletagmanager.com https://www.google-analytics.com https://www.facebook.com https://ssl.gstatic.com https://www.gstatic.com",
      // Tailwind/inline styles + Next.js
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      // GTM preview iframe
      "frame-src 'self' https://www.googletagmanager.com https://www.google.com",
      "object-src 'none'",
    ].join('; ')

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
        ],
      },
      {
        // Security headers + CSP en todas las páginas
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

export default nextConfig
