import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),

        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("proxi:", req.method, req.url, "→", proxyReq.path);
          });
        },
      },
    },
  },
});
