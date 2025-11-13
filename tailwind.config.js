/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Airtable-inspired primary blue palette
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAD6FF',
          300: '#8AB8FF',
          400: '#5A9AFF',
          500: '#2D7FF9',  // Airtable signature blue
          600: '#1D6BE8',
          700: '#1557CF',
          800: '#0F44A8',
          900: '#0A3382',
        },
        // Refined gray palette for Airtable aesthetic
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#E4E7EC',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
        },
        // Success states (green)
        success: {
          50: '#ECFDF3',
          100: '#D1FADF',
          200: '#A6F4C5',
          300: '#6CE9A6',
          400: '#32D583',
          500: '#18B368',
          600: '#079455',
          700: '#067647',
          800: '#085D3A',
          900: '#074D31',
        },
        // Warning states (amber/yellow)
        warning: {
          50: '#FFFAEB',
          100: '#FEF0C7',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#F79009',
          600: '#DC6803',
          700: '#B54708',
          800: '#93370D',
          900: '#7A2E0E',
        },
        // Danger/error states (red)
        danger: {
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A1A16',
        },
        // Additional Airtable accent colors
        purple: {
          50: '#F4F3FF',
          100: '#EBE9FE',
          500: '#7F56D9',
          600: '#6941C6',
        },
        teal: {
          50: '#F0FDF9',
          100: '#CCFBEF',
          500: '#15B79E',
          600: '#0E9384',
        },
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      // Softer, more subtle shadows inspired by Airtable
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'sm': '0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px 0 rgba(16, 24, 40, 0.06)',
        'soft': '0 2px 4px -2px rgba(16, 24, 40, 0.06), 0 4px 8px -2px rgba(16, 24, 40, 0.10)',
        'md': '0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'medium': '0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -1px rgba(16, 24, 40, 0.04)',
        'lg': '0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
        'large': '0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.04)',
        'xl': '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
        'hover': '0 6px 12px -2px rgba(16, 24, 40, 0.08), 0 3px 7px -3px rgba(16, 24, 40, 0.10)',
        'focus': '0 0 0 4px rgba(45, 127, 249, 0.12)',
      },
      // Airtable-style border radius
      borderRadius: {
        'sm': '0.375rem',   // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.625rem',   // 10px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Smooth transitions
      transitionDuration: {
        '400': '400ms',
      },
      // Animation utilities
      animation: {
        'fade-in': 'fadeIn 200ms ease-in',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}