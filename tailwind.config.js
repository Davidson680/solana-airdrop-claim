/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        solana: {
          purple: '#9945FF',
          green: '#14F195',
          dark: '#1a1a2e',
        },
      },
      backgroundImage: {
        gradient: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(153, 69, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(153, 69, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
