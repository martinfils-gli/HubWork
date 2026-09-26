/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tempus: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#c3d6fd',
          300: '#94b8fb',
          400: '#5e90f7',
          500: '#3b6cf2',
          600: '#254ce6',
          700: '#1d3ab8',
          800: '#1d3294',
          900: '#1d2c75',
          950: '#111948',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
