/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#47a7c7",
        "primary-light": "#E6F7FB",
        "primary-dark": "#067fa8"    
      },
    },
  },
  plugins: [],
}
