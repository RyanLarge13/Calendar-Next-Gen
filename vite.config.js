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
      strategies: "injectManifest",
      injectRegister: false,
      includeAssets: [
        "favicon.svg",
        "badge.svg",
        "ios/180.png",
        "android/android-launchericon-512-512.png",
        "robots.txt",
        "sw.js",
        "registerSw.js",
      ],
      manifest: {
        name: "Calendar Next Gen",
        short_name: "CNG",
        description:
          "A next generation calendar application built for the orginized and busy",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        serviceworker: "/sw.js",
        icons: [
          {
            src: "android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
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
              src: "android/android-launchericon-512-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      ],
      workbox: {
        injectRegister: false,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/calendar-next-gen-production\.up\.railway\.app\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
            },
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
});
