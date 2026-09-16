/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05070F',
          900: '#080B18',
          850: '#0B0F1F',
          800: '#111629',
          700: '#1A2038',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        neon: {
          cyan: '#22D3EE',
          violet: '#A855F7',
          pink: '#F472B6',
          lime: '#A3E635',
          amber: '#FBBF24',
        },
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(99,102,241,0.55)',
        'glow-lg': '0 0 80px -20px rgba(139,92,246,0.65)',
        card: '0 20px 60px -30px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)',
        aurora:
          'radial-gradient(60% 60% at 20% 20%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(50% 50% at 80% 10%, rgba(34,211,238,0.28) 0%, transparent 60%), radial-gradient(55% 55% at 60% 90%, rgba(168,85,247,0.3) 0%, transparent 60%)',
      },
      backgroundSize: {
        grid: '56px 56px',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(1.5deg)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-28px)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-8%,0) scale(1.08)' },
          '66%': { transform: 'translate3d(-7%,6%,0) scale(0.96)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '70%': { transform: 'scale(2.2)', opacity: '0' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        tick: {
          '0%,100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        drift: 'drift 22s ease-in-out infinite',
        marquee: 'marquee var(--marquee-duration,38s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--marquee-duration,26s) linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.24,0,0.38,1) infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        tick: 'tick 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
