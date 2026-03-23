/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0d0d0f',
          2: '#151518',
          3: '#1c1c21',
          4: '#242429',
        },
        accent: {
          DEFAULT: '#7c6ff7',
          2: '#a89cf7',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
