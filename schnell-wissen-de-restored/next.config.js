/** @type {import('next').NextConfig} */

// GitHub Pages deployment configuration
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
const repoName = 'artikel-webseite'

const nextConfig = {
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Set base path and asset prefix for GitHub Pages only when deploying
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  
  // Remove trailing slash requirement for development
  trailingSlash: false,
  
  // Force use of webpack instead of SWC
  swcMinify: false,
  
  // Webpack configuration - simple and stable for Next.js 14
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable parallelism to avoid worker issues
      config.parallelism = 1
      
      // Simple watch options
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      
      // Disable optimization in development
      config.optimization.minimize = false
      config.optimization.splitChunks = false
      
      // Disable cache
      config.cache = false
    }
    
    return config
  },
  
  // Simple experimental config for Next.js 14
  experimental: {
    esmExternals: false,
  },
  
  // Environment variables
  env: {
    DISABLE_SWC_BINARY: 'true',
    NEXT_TELEMETRY_DISABLED: '1',
  }
}

module.exports = nextConfig