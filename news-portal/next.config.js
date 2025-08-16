/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  swcMinify: false,
  experimental: { 
    turbo: {}
  },
  webpack(config) {
    config.optimization.minimize = false;
    return config;
  },
  async redirects() {
    return [
      // Legacy article paths
      {
        source: '/articles/:slug',
        destination: '/redirect-legacy/:slug',
        permanent: false,
      },
      {
        source: '/artikel/:slug',
        destination: '/redirect-legacy/:slug',
        permanent: false,
      },
    ];
  },
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://','').replace('/','')
    ].filter(Boolean),
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: https://images.unsplash.com https://via.placeholder.com https://picsum.photos https://*.supabase.co https://www.google-analytics.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
              "media-src 'self'",
              "object-src 'none'",
              "frame-src 'self' https://www.youtube.com https://www.google.com",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};