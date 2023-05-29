import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      mode: "production",
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "550x550.png",
        "icon.png",
        "robots.txt",
        "sw.js",
      ],
      manifest: {
        name: "Calendar Next Gen",
        short_name: "CNG",
        description:
          "A next generation calendar application built for the orginized and busy",
        start_url: "/",
        display: "fullscreen",
        orientation: "landscape",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        serviceworker: "/sw.js",
        icons: [
          {
            src: "favicon.svg",
            sizes: "321x321",
            type: "svg",
          },
          {
            src: "icon.png",
            sizes: "321x321",
            type: "png",
            purpose: "any",
          },
          {
            src: "550x550.png",
            sizes: "512x512",
            type: "png",
            purpose: "any maskable",
          },
          {
            src: "550x550.png",
            sizes: "550x550",
            type: "png",
            purpose: "maskable",
          },
        ],
      },
      splash_pages: [],
      custom_splash_pages: [
        {
          name: "Custom Splash Screen",
          backgroundColor: "#ffffff",
          assets: [
            {
              src: "550x550.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      ],
      strategies: "generateSW",
      workbox: {
        navigateFallback: "/index.html",
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
});
