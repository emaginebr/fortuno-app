/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/nauth-react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        fortuno: {
          green: {
            deep: 'var(--fortuno-green-deep)',
            elegant: 'var(--fortuno-green-elegant)',
          },
          gold: {
            intense: 'var(--fortuno-gold-intense)',
            soft: 'var(--fortuno-gold-soft)',
          },
          black: 'var(--fortuno-black)',
          offwhite: 'var(--fortuno-offwhite)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
