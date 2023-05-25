self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.notes,
    icon: "/favicon.svg",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
