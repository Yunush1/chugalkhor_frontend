/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f8cff",
        accent: "#a259f7",
        darkBg: "#070c18",
        darkPanel: "#0e1329",
        lightBg: "#f8fafc",
        lightPanel: "#ffffff",
        textDark: "#e2e8f0",
        textLight: "#1e293b",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
      animation: {
        fadeUp: "fadeUp 0.55s ease-out forwards",
        float: "float 5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(18px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
}

