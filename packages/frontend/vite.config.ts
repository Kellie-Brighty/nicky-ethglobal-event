<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    // This is needed for OpenAI to work in Vite
    global: "globalThis",
  },
});
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    // This is needed for OpenAI to work in Vite
    global: "globalThis",
  }
});
>>>>>>> 88b1ce773bdea785d9c43b491c4066c9596f775d
