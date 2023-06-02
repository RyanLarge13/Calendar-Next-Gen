self.addEventListener("push", async (event) => {
	try{
  const data = event.data.json();
  const options = {
    body: data.notes,
    icon: "/favicon.svg",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
	} catch (err) {
		console.log(err)
	}
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
