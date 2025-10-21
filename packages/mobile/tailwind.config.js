/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        background: "#1a1a1a",
        surface: "#2a2a2a",
        card: "#2a2a2a",
        text: "#ffffff",
        "text-secondary": "#cccccc",
        border: "#444444",
      },
    },
  },
  plugins: [],
};
