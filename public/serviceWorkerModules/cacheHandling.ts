/// <reference lib="webworker" />

const productionUrl = "https://calendar-next-gen-production.up.railway.app";

export const markResponseSource = async (response, source) => {
  const headers = new Headers(response.headers);
  headers.set("x-sw-source", source);

  return new Response(await response.clone().blob(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const interceptUserData = (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open("user-cache");
      const cachedResponse = await cache.match(event.request);

      // if (cachedResponse) only runs if /user/data already exists in cache
      if (cachedResponse) {
        event.waitUntil(
          (async () => {
            try {
              const networkResponse = await fetch(event.request);
              if (networkResponse && networkResponse.ok) {
                await cache.put(event.request, networkResponse.clone());

                const clients = await self.clients.matchAll();
                clients.forEach((client) => {
                  client.postMessage({ type: "user-cache-update" });
                });
              }
            } catch (err) {
              console.log(`Error updating cache from network: ${err}`);
            }
          })(),
        );

        return markResponseSource(cachedResponse, "cache");
      }

      try {
        const networkResponse = await fetch(event.request);

        if (networkResponse && networkResponse.ok) {
          await cache.put(event.request, networkResponse.clone());
          return markResponseSource(networkResponse, "network");
        }

        return markResponseSource(networkResponse, "network-non-ok");
      } catch (err) {
        console.log(
          `Error fetching user data from initial load in service worker: ${err}`,
        );
      }

      return new Response("Unable to load user data", {
        status: 503,
        headers: {
          "x-sw-source": "none",
        },
      });
    })(),
  );
};

export const grabFreshCache = (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open("user-cache");
      const cachedResponse = await cache.match(`${productionUrl}/user/data`);
      if (cachedResponse) {
        // Why does this cache response contain network? It is because this fetch interception event
        // is called ONLY after a successful cache update is made with fresh server data
        // creating the stale while revalidate effect next level. So yes, this is a cache response
        // but we know for fact it is with most relevant server data
        return markResponseSource(cachedResponse, "network");
      } else {
        return new Response("No cache", { status: 404 });
      }
    })(),
  );
};
