/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-xy': 'gradient 15s ease infinite',
        'blob': 'blob 7s infinite',
        'drive-right': 'drive-right 15s linear infinite',
        'drive-left': 'drive-left 15s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'draw-path': 'draw-path 3s ease-out forwards',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)'
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)'
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)'
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)'
          }
        },
        'drive-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        'drive-left': {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'draw-path': {
          '0%': { 'stroke-dashoffset': '1000' },
          '100%': { 'stroke-dashoffset': '0' },
        },
      }
    }
  },
  plugins: [],
};
