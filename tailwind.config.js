/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'color-1': '#2D4059',
        'color-2': '#555555',
        'color-3': '#9F9F9F',
        'color-4': '#D0D0D0',
        'color-5': '#F5F5F5'
      },
      fontFamily: {
        Poppins: ["Poppins", "cursive"],
      },
      screens: {
        'xxs': '360px',
        'xs': '480px'
      }
    },
  },
  plugins: [],
}

