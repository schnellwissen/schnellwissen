import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',  // Extra small breakpoint für kleine Smartphones
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        accent: 'var(--accent)',
        warning: 'var(--warning)',
        bg: 'var(--bg)',
        card: 'var(--card)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '12px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;