/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clario: {
          blue: '#33409E',      // Royal Cobalt
          light: '#7B8AE0',     // Secondary interactive tint
        },
        accent: {
          coral: '#FB7185',     // Accent coral
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F8FAFC',
        },
        content: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
        status: {
          verified: '#10B981',  // Emerald
          pending: '#F59E0B',   // Amber
          rejected: '#EF4444',  // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
        display: ['"Cabinet Grotesk"', '"Clash Display"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'light-card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 20px 30px -10px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        'light-float': '0 25px 50px -12px rgba(79, 70, 229, 0.12), 0 12px 24px -8px rgba(15, 23, 42, 0.06)',
        'light-glow': '0 0 25px rgba(79, 70, 229, 0.15)',
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

