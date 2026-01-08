/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // wytspace Dark Theme
        wyt: {
          bg: '#0a0a0a',
          'bg-light': '#111111',
          'bg-card': '#1a1a1a',
          accent: '#3B82F6',
          'accent-hover': '#2563EB',
          text: '#FFFFFF',
          'text-secondary': '#9CA3AF',
          'text-muted': '#6B7280',
          border: '#2a2a2a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        starBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'slide-in-up': 'slideInUp 0.5s ease-out forwards',
        'star-bounce': 'starBounce 0.4s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
