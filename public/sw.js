import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /^https:\/\/calendar-next-gen-production\.up\.railway\.app\//,
  new NetworkFirst({
    cacheName: "api-cache",
  })
);

self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (error) {
      payload = { title: "Notification", body: event.data.text() };
    }
  } else {
    payload = {
      title: "were so sorry",
      body: "An issue occurred sending the correct notification data, please refresh & try again",
    };
  }
  const { title, body } = payload;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "./favicon.svg",
      badge: "./badge.svg",
      vibrate: [100, 100, 100],
      actions: [
        { action: "delete-notif", title: "Delete" },
        { action: "mark-as-read", title: "Mark as Read" },
      ],
    })
  );
});

self.addEventListener("notificationclick", (event, payload) => {
  console.log(event, payload);
  if (event.action === "mark-as-read") {
    fetch("https://calendar-next-gen-production.up.railway.app/mark-as-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifId: payload.id,
      }),
    })
      .then((response) => {
        event.notification.close();
      })
      .catch((error) => {
        event.notification.close();
        console.log(`Error marking notification as read: ${error}`);
      });
  }
  if (event.action === "delete-notif") {
    fetch(
      `https://calendar-next-gen-production.up.railway.app/delete-notif/notification/${payload.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifId: payload.id,
        }),
      }
    )
      .then((response) => {
        event.notification.close();
      })
      .catch((error) => {
        event.notification.close();
        console.log(`Error marking notification as read: ${error}`);
      });
  } else {
    event.notification.close();
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === "https://www.calng.app") {
              return client.focus();
            }
          }
          return clients.openWindow("https://www.calng.app");
        })
    );
  }
});

//backgorun and periodic sync
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(backgroundSync()); // Call your sync function
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "periodic-sync") {
    event.waitUntil(periodicSync()); // Call your periodic sync function
  }
});

const backgroundSync = () => {};

const periodicSync = () => {};
