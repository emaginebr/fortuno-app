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
      boxShadow: {
        'noir-card': 'var(--shadow-noir-card)',
        'noir-card-hover': 'var(--shadow-noir-card-hover)',
        'noir-marker': 'var(--shadow-noir-marker)',
        'noir-marker-on': 'var(--shadow-noir-marker-on)',
        'gold-glow': 'var(--shadow-gold-glow)',
        'gold-focus': 'var(--shadow-gold-focus)',
        'hero-stage': 'var(--shadow-hero-stage)',
        'hero-panel': 'var(--shadow-hero-panel)',
        'paper': 'var(--shadow-paper)',
        'paper-hover': 'var(--shadow-paper-hover)',
        'dropdown': 'var(--dropdown-shadow)',
      },
      backgroundImage: {
        'noir-page': 'var(--noir-bg-page)',
        'noir-glass': 'var(--noir-glass-surface)',
        'noir-hero': 'var(--noir-bg-hero)',
        'noir-final': 'var(--noir-bg-final-cta)',
        'noir-cert': 'var(--noir-certificate-bg)',
        'rail-track': 'var(--rail-track)',
        'rail-fill': 'var(--rail-fill)',
        'gold-divider': 'var(--gold-divider)',
        'gold-divider-v': 'var(--gold-divider-v)',
        'marker-pending': 'var(--marker-metal-pending)',
        'marker-active': 'var(--marker-metal-active)',
        'marker-done': 'var(--marker-metal-done)',
        'stats-band': 'var(--stats-band-bg)',
        'metal-casino': 'var(--metal-casino-card)',
        'hero-overlay': 'var(--hero-stage-overlay)',
        'hero-grain': 'var(--hero-stage-grain)',
        'hero-panel': 'var(--hero-panel-bg)',
        'hero-seal': 'var(--hero-seal-bg)',
        'hero-seal-hover': 'var(--hero-seal-bg-hover)',
        'hero-fallback': 'var(--hero-fallback-bg)',
        'dash-page': 'var(--dash-bg-page)',
        'dash-header': 'var(--dash-header-bg)',
        'dash-footer': 'var(--dash-footer-band-bg)',
        'card-gold-bar': 'var(--card-gold-bar)',
        'gold-divider-soft': 'var(--gold-divider-soft)',
        'chip-glass': 'var(--chip-glass-bg)',
        'avatar-ring': 'var(--avatar-ring)',
        'stat-numeral': 'var(--stat-numeral-gradient)',
        'topbar': 'var(--topbar-bg)',
        'topbar-border-bottom': 'var(--topbar-border-bottom)',
        'dropdown-divider': 'var(--dropdown-divider)',
      },
      transitionTimingFunction: {
        'noir-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'noir-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'noir-fast': '160ms',
        'noir-base': '240ms',
        'noir-slow': '420ms',
      },
      keyframes: {
        'marker-breath': {
          '0%, 100%': {
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 0 0 4px rgba(184,150,63,0.18), 0 8px 26px -6px rgba(184,150,63,0.55)',
          },
          '50%': {
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 0 0 6px rgba(184,150,63,0.10), 0 10px 32px -6px rgba(184,150,63,0.65)',
          },
        },
        'check-pop': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rail-pulse': {
          '0%, 100%': { opacity: '0', transform: 'translateY(0)' },
          '50%': { opacity: '0.9', transform: 'translateY(8px)' },
        },
        'live-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.65)' },
          '70%': { boxShadow: '0 0 0 8px rgba(212,175,55,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0)' },
        },
        'progress-shimmer': {
          '0%': { left: '-40%' },
          '100%': { left: '110%' },
        },
        'numeral-shimmer': {
          '0%, 20%': { backgroundPosition: '-200% 0', opacity: '0' },
          '40%': { opacity: '0.9' },
          '65%': { opacity: '0.6' },
          '100%': { backgroundPosition: '200% 0', opacity: '0' },
        },
        'particle-float': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '70%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-120vh) scale(0.4)', opacity: '0' },
        },
        'shimmer-trail': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'breath-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'avatar-breath': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)', opacity: '0.75' },
          '50%': { transform: 'rotate(180deg) scale(1.03)', opacity: '0.95' },
        },
        'check-bounce': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'user-menu-open': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(-6px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'marker-breath': 'marker-breath 2.6s ease-in-out infinite',
        'check-pop': 'check-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'rail-pulse': 'rail-pulse 2.4s ease-in-out infinite',
        'live-pulse': 'live-pulse 1.8s ease-in-out infinite',
        'progress-shimmer': 'progress-shimmer 2.4s ease-in-out infinite',
        'numeral-shimmer': 'numeral-shimmer 4.8s ease-in-out infinite',
        'particle-float': 'particle-float 14s linear infinite',
        'shimmer-trail': 'shimmer-trail 1.6s ease-in-out infinite',
        'breath-glow': 'breath-glow 2.6s ease-in-out infinite',
        'avatar-breath': 'avatar-breath 6s ease-in-out infinite',
        'check-bounce': 'check-bounce 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'user-menu-open': 'user-menu-open 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
