/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Specify paths where your HTML/JSX/TSX files are located
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],  // Adding custom font for display
    },
    extend: {
      // Colors used in the project
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage:{
        'login-bg-img': "url('./src/assets/images/login_bg.jpg')",
          'signup-bg-img': "url('./src/assets/images/signup_bg.png')",
      }
    },
  },
  plugins: [],
}
