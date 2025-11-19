import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Allow larger request bodies for file uploads (proxy to backend)
    // Actual file size limits are configured in axios (50MB in problemApi.ts)
    proxy: {
      // Uncomment and configure when backend is ready
      // '/api': {
      //   target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
  },
})