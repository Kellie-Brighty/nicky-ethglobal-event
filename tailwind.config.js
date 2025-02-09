/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        dark: {
          primary: "#111827", // Main background
          secondary: "#221F2E", // Card background
          accent: "#9A6FFE", // Purple accent
        },
        primary: "#yourPrimaryColor", // Replace with your actual primary color
        "neon-blue": "#00f2fe",
        "neon-green": "#39ff14",
      },
      animation: {
        gradientFlow: "gradientFlow 5s linear infinite",
      },
      keyframes: {
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "150% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
