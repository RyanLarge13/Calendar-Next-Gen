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
        id: "app.calng.calendarnextgen",
        name: "Calendar Next Gen",
        short_name: "CNG",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        lang: "en",
        scope: "/",
        description:
          "A next generation calendar application built for the orginized and busy",
        orientation: "portrait",
        theme_color: "#ffffff",
        serviceworker: "/sw.js",
        prefer_related_applications: false,
        dir: "ltr",
        display_override: ["window-controls-overlay", "standalone"],
        categories: ["business", "lifestyle", "productivity", "utilities"],
        handle_links: "auto",
        "edge_side_panel.preferred_width": {
          preferred_width: 100,
        },
        launch_handler: {
          client_mode: "focus-existing",
        },
        scope_extensions: [{ origin: "*calng.app" }],
        screenshots: [
          {
            src: "/screenshots/calng-mobile.png",
            sizes: "509x802",
            type: "image/jpg",
            platform: "wide",
          },
          {
            src: "/screenshots/calng-desktop.png",
            sizes: "1369x799",
            type: "image/jpg",
            platform: "wide",
          },
        ],
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
            purpose: "maskable any",
          },
        ],
        shortcuts: [
          {
            name: "Create Event",
            short_name: "Event +",
            url: "/",
            description: "Create a new event for today",
            icons: [
              {
                src: "android/android-launchericon-192-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Create Reminder",
            short_name: "Reminder +",
            url: "/",
            description: "Create a new reminder for today",
            icons: [
              {
                src: "android/android-launchericon-192-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
        share_target: {
          action: "/",
          method: "POST",
          enctype: "application/x-www-form-urlencoded",
          params: {
            title: "Share Event",
            url: "/",
          },
        },
        actions: [
          {
            name: "calendar",
            method: "GET",
            href: "/",
          },
        ],
        file_handlers: [
          {
            action: "/open-pdf",
            accept: {
              "application/pdf": [".pdf"],
            },
            icons: [
              {
                src: "pdf-icon.png",
                sizes: "256x256",
                type: "image/png",
              },
            ],
            launch_type: "single-client",
          },
          {
            action: "/show-model",
            accept: {
              "application/sla": ".stl",
              "application/octet-stream": ".fbx",
            },
            icons: [
              {
                src: "3d-printer-icon.png",
                sizes: "256x256",
                type: "image/png",
              },
            ],
            launch_type: "multiple-clients",
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
            urlPattern: /\.(js|css|png|svg|jpeg|jpg)$/, // Cache static assets by file extensions
            handler: "StaleWhileRevalidate", // Cache the files on first load
            options: {
              cacheName: "static-assets-cache",
            },
          },
          {
            urlPattern:
              /^https:\/\/calendar-next-gen-production\.up\.railway\.app\/user\/data/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
            },
          },
        ],
      },
    }),
  ],
  base: "/",
  build: {
    sourcemap: true,
  },
});
