/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This is important!
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        // New neon theme colors
        'neon-blue': '#00f2fe',
        'neon-green': '#39ff14',
        'light-gray': '#f3f4f6',
        dark: {
          primary: '#000000',    // Pure black for deep contrast
          secondary: '#111827',  // Dark background
          accent: '#00f2fe',    // Using neon blue as accent
        },
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}
