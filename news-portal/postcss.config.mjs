/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Nur für moderne Browser
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead', 'not IE 11']
    },
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          convertValues: true,
          reduceIdents: true,
          mergeRules: true,
          minifyFontValues: true,
          minifySelectors: true,
        }]
      }
    } : {})
  },
};

export default config;
