/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired Light Theme
        light: {
          bg: '#F5F5F7',
          surface: '#FFFFFF',
          text: '#1D1D1F',
          textSecondary: '#86868B',
          border: '#E5E5EA',
        },
        // Apple-inspired Dark Theme
        dark: {
          bg: '#000000',
          surface: '#1C1C1E',
          text: '#FFFFFF',
          textSecondary: '#98989D',
          border: '#38383A',
        },
        // Accent colors
        accent: {
          DEFAULT: '#007AFF',
          dark: '#0A84FF',
        },
        success: {
          DEFAULT: '#34C759',
          dark: '#30D158',
        },
        warning: {
          DEFAULT: '#FF9500',
          dark: '#FF9F0A',
        },
        error: {
          DEFAULT: '#FF3B30',
          dark: '#FF453A',
        },
        // Status colors
        status: {
          open: '#86868B',
          inProgress: '#007AFF',
          done: '#34C759',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

