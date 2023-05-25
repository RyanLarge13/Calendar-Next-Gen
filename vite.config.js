import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { GenerateSW } from "workbox-webpack-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "sw.js", "sw_cache.js"],
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
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,gif,ico,json}"],
        // Exclude the following files from caching
        exclude: ["node_modules/**/*", "sw.js", "sw_cache.js"],
        // Set the maximum cache size
        maximumFileSizeToCacheInBytes: 5000000,
        // Customize caching strategies
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api.example.com\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
            },
          },
          // Add more runtime caching strategies as needed
        ],
      },
    }),
  ],
});
