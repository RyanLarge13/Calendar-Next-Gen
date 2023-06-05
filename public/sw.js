import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { clientsClaim } from "workbox-core";

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST);
self.skipWaiting();
clientsClaim();

// Cleanup outdated caches

// Cache API endpoints
registerRoute(
  /\/calendar-next-gen-production.up.railway.app\/.*/,
  new workbox.strategies.NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Maximum number of entries in the cache
        maxAgeSeconds: 7 * 24 * 60 * 60, // Maximum age of cache entries in seconds 7 days
      }),
    ],
  })
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("push", async (event) => {
  try {
    const data = event.data.json();
    const options = {
      body: data.notes,
      icon: "/favicon.svg",
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (err) {
    console.log(err);
  }
});
