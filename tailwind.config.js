/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Baloo 2', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          glow: '#ff5b8a',
        },
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0,0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '90%': { opacity: '0.9' },
          '100%': {
            transform: 'translate(var(--drift,0), -110vh) rotate(360deg)',
            opacity: '0',
          },
        },
        wobble: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float linear infinite',
        wobble: 'wobble 2.2s ease-in-out infinite',
        pop: 'pop 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
