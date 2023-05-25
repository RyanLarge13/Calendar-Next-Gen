self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.notes,
    icon: "/favicon.svg",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

//cacheing
const cacheName = "app1";

const cacheAssets = ["index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(cacheAssets);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
