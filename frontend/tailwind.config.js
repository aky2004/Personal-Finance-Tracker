/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        // MoneyMatter color system
        brand: {
          DEFAULT: '#7355be',
          hover: '#6343af',
          light: '#f5f3fb',
          dark: '#9376de',
          text: '#6a4bb5',
        },
        surface: {
          light: '#fbfbfd',
          dark: '#0b0908',
        },
        panel: {
          light: '#ffffff',
          dark: '#1b1917',
        },
        soft: {
          light: '#f3f2f7',
          dark: '#282624',
        },
        borderline: {
          light: '#e6e5ee',
          dark: '#2c2825',
        },
        ink: {
          light: '#17151f',
          muted: '#66637a',
          dark: '#f5f3f0',
          darkmuted: '#a1a1aa',
        },
        money: {
          green: '#1b7f4d',
          greendark: '#4cc38a',
          red: '#c24129',
          reddark: '#ef6a57',
        },
      },
      boxShadow: {
        'moneymatter': '0 1px 2px rgba(23, 21, 31, 0.04), 0 14px 34px -20px rgba(40, 30, 80, 0.16)',
        'moneymatter-dark': '0 1px 2px rgba(0, 0, 0, 0.3), 0 18px 40px -22px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}
