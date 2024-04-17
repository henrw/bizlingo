/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': ['Nunito', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        "theme-green": "#58CC02",
        "blue-text": "#1899D6",
        "blue-outline": "#84D8FF",
        "blue-bg": "#DDF4FF",
        "green-button": "#42C62F",
        "green-panel": "#D7FFB8",
        "green-text": "#489D26",
        "yellow-text": "#FFC800"
      },
    },
  },
  plugins: [],
};
