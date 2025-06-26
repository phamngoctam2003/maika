/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '0px',
      },
      colors: {
        'maika-500': '#15A781',
      },
      backgroundColor:  {
        'maika-500': '#15A781',
      },
    },
  },
  plugins: [],
}

