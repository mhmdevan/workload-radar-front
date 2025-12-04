const { defineConfig } = require("vite");
const vue = require("@vitejs/plugin-vue");
const path = require("node:path");

// Vite config with Vue and proxy for backend API.
// This keeps the browser on the same origin (http://localhost:5173),
// while Vite proxies /api/* calls to the Flask backend on http://localhost.
module.exports = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost", // or 'http://localhost:8000' if your backend listens there
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
