/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        potta: ['"Potta One"', "cursive"],
      },
      colors: {
        background: "#FCF4EB",
        orange: "#F98D08",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
