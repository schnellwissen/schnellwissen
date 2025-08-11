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
            value: "img-src https: data: https://images.unsplash.com https://via.placeholder.com https://picsum.photos https://*.supabase.co;"
          }
        ],
      },
    ];
  },
};