import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bildoptimierung
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'uabmwhtoimelqpuhyluz.supabase.co',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [279, 640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 Tage Cache
  },

  // JavaScript Optimierung
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Performance Optimierungen
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash',
      'react-hook-form',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'clsx',
      'tailwind-merge',
    ],
  },

  // Bundling Optimierungen
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },

  // HTTP Header für bessere Performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Komprimierung aktivieren
  compress: true,

  // React Strict Mode für bessere Fehlererkennung
  reactStrictMode: true,

  // Polyfills reduzieren - nur moderne Browser unterstützen
  transpilePackages: [],
};

export default nextConfig;
