/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        buzz: {
          yellow: '#F5C400',
          'yellow-light': '#FFD21F',
          'yellow-dark': '#D4A000',
          black: '#09090B',
          charcoal: '#121215',
          card: '#18181B',
          'card-hover': '#242429',
          border: '#27272A',
          gray: '#A1A1AA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'buzz-glow': '0 0 25px -5px rgba(245, 196, 0, 0.3)',
        'buzz-glow-lg': '0 0 50px -10px rgba(245, 196, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
