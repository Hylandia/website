/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#be5f57",
        secondary: "#f09963",
        tertiary: "#e99071",
        accent: "#b1b67c",
        neutral: "#2c343f",
      },
      fontFamily: {
        sans: ["var(--font-cinzel)", "serif"],
        mono: ["var(--font-medieval)", "monospace"],
        decorative: ["var(--font-cinzel-decorative)", "serif"],
      },
    },
  },
  plugins: [],
};
