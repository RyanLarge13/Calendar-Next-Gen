import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      mode: "development",
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "sw.js"],
      manifest: {
        name: "Calendar Next Gen",
        short_name: "CNG",
        description:
          "A next generation calendar application built for the orginized and busy",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "192x192",
            type: "svg",
          },
        ],
      },
      strategies: "generateSW",
      workbox: {
        navigateFallback: "/index.html",
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
});
