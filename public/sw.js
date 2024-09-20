import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

const productionUrl = "https://calendar-next-gen-production.up.railway.app";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) =>
    request.destination === "style" || request.destination === "script",
  new CacheFirst({
    cacheName: "script-style-cache",
  })
);

registerRoute(
  ({ request }) => request.destination === "document",
  new CacheFirst({
    cacheName: "html-cache",
  })
);

registerRoute(
  ({ request }) =>
    request.destination === "image" && request.url.endsWith(".svg"),
  new CacheFirst({
    cacheName: "svg-cache",
  })
);

registerRoute(
  ({ request }) =>
    request.destination === "image" && request.url.endsWith(".png"),
  new CacheFirst({
    cacheName: "png-cache",
  })
);

self.skipWaiting();

const formatDbText = (text) => {
  if (typeof text !== "string") {
    return "";
  }
  const delimiter = "|||";
  if (text.includes(delimiter)) {
    const formattedText = text
      .split(delimiter)
      .map((part) => part.trim())
      .join("\n");
    return formattedText;
  } else {
    return text.trim();
  }
};

// Install redundant at the moment from use of workbox and VitePWA config automatically handling static assets
// self.addEventListener("install", event => {});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [""];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/user/data")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((response) => {
            return caches.open("user-data").then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
        );
      })
    );
  }
});

self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (error) {
      payload = {
        title: "Notification",
        body: event.data.text(),
      };
    }
  } else {
    payload = {
      title: "were so sorry",
      body: "An issue occurred sending the correct notification data, please refresh & try again",
    };
  }
  const { title, body, data } = payload;
  const { notifType, time } = data;
  if (notifType === "event") {
    return event.waitUntil(
      self.registration.showNotification(title, {
        body: `${formatDbText(body || "")} \n ${new Date(
          time
        ).toLocaleTimeString("en-US")}`,
        data,
        icon: "./event-icon.svg",
        badge: "./badge.svg",
        vibrate: [100, 100, 100],
        actions: [
          { action: "delete-notif", title: "Delete", type: "button" },
          { action: "mark-as-read", title: "Mark as Read", type: "button" },
          { action: "open-app", title: "Open App", type: "button" },
        ],
      })
    );
  }
  if (notifType === "reminder") {
    return event.waitUntil(
      self.registration.showNotification(title, {
        body: `${formatDbText(body || "")} \n @${new Date(
          time
        ).toLocaleTimeString("en-US")}`,
        data,
        icon: "./rem-icon.svg",
        badge: "./badge.svg",
        vibrate: [100, 100, 100],
        actions: [
          { action: "delete-notif", title: "Delete", type: "button" },
          { action: "mark-as-read", title: "Mark as Read", type: "button" },
          { action: "open-app", title: "Open App", type: "button" },
        ],
      })
    );
  }
  if (notifType === "system") {
    return event.waitUntil(
      self.registration.showNotification(title, {
        body: `${formatDbText(body || "")} \n @${new Date(
          time
        ).toLocaleTimeString("en-US")}`,
        data,
        icon: "./sys-icon.svg",
        badge: "./badge.svg",
        vibrate: [100, 100, 100],
        actions: [
          { action: "close-notif", title: "Close", type: "button" },
          { action: "open-app", title: "Open App", type: "button" },
        ],
      })
    );
  }
});

const openApp = (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        let matchingWindow = null;
        for (const client of clientList) {
          if (
            client.url === "https://www.calng.app/" ||
            client.url === "https://www.calng.app"
          ) {
            matchingWindow = client;
            if (client.focused) {
              return client.focus();
            }
          }
        }
        if (matchingWindow) {
          return matchingWindow.focus();
        }
        return clients.openWindow("https://www.calng.app/");
      })
  );
};

self.addEventListener("notificationclick", (event) => {
  event.preventDefault();
  const notifId = event.notification.data.id;
  if (event.action === "close-notif") {
    event.notification.close();
  }
  if (event.action === "open-app") {
    openApp(event);
  }
  if (event.action === "mark-as-read") {
    event.notification.close();
    fetch(`${productionUrl}/mark-as-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifId: notifId,
      }),
    })
      .then(() => {
        event.notification.close();
      })
      .catch((error) => {
        event.notification.close();
        console.log(`Error marking notification as read: ${error}`);
      });
  }
  if (event.action === "delete-notif") {
    event.notification.close();
    fetch(`${productionUrl}/delete-notif/notification/${notifId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifId: notifId,
      }),
    })
      .then(() => {
        event.notification.close();
      })
      .catch((error) => {
        event.notification.close();
        console.log(`Error marking notification as read: ${error}`);
      });
  } else {
    openApp(event);
  }
});

self.addEventListener("message", async (event) => {
  console.log(
    `Service worker accepting a message event from the client: ${event}`
  );
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.command === "close-notifications") {
    closeOpenNotifications();
    console.log("Closing notifications");
  }
  if (event.data && event.data.command === "user-cache-update") {
    console.log("user cache update from front-end manually called");
    event.waitUntil(periodicSync(event.data.token));
  }
});

const closeOpenNotifications = () => {
  self.registration.getNotifications().then((notifications) => {
    console.log(`Fetched notifications. length: ${notifications.length}`);
    notifications.forEach((notification, index) => {
      console.log(`Closing notification at index: ${index}`);
      notification.close();
    });
  });
};

const getTokenFromDb = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myCalngDB", 2);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["auth"], "readonly");
      const store = transaction.objectStore("auth");
      const tokenRequest = store.get(0);
      tokenRequest.onsuccess = () =>
        resolve(tokenRequest.result ? tokenRequest.result.token : null);
      tokenRequest.onerror = () => reject(tokenRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
};

//background and periodic sync
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(backgroundSync());
  }
});

self.addEventListener("periodicsync", async (event) => {
  if (event.tag === "periodic-sync") {
    try {
      console.log("Fetching token from indexDB in service worker");
      const token = await getTokenFromDb();
      if (!token) {
        console.log("No token in indexDB for periodic sync");
        return;
      }
      event.waitUntil(periodicSync(token));
    } catch (err) {
      console.log(`Error pulling token from db: ${err}`);
    }
  }
});

const backgroundSync = () => {};

const periodicSync = async (token) => {
  const cache = await caches.open("user-data");
  console.log("opening cache");
  try {
    const response = await fetch(`${productionUrl}/user/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    await cache.put(`${productionUrl}/user/data`, response.clone());
    const data = await response.json();
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "user-data-update",
          data: data,
        });
      });
    });

    console.log("Periodic sync success");
  } catch (err) {
    console.log(`Error during periodic sync: ${err}`);
  }
};
