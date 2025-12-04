/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          500: "#f97316",
          600: "#ea580c",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15,23,42,0.7)",
      },
    },
  },
  plugins: [],
};
