/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#0f2b5b', // Citadel-like deep blue
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-green': 'pulseGreen 1s ease-in-out',
        ticker: 'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseGreen: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(34,197,94,0)' } },
        ticker: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } },
      },
    },
  },
  plugins: [],
};
