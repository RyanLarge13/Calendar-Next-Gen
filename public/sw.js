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
      actions: [{ action: "mark-as-read", title: "Mark as Read" }],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  if (event.action === "mark-as-read") {
    fetch("https://calendar-next-gen-production.up.railway.app/mark-as-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifId: event.notification.data.id,
      }),
    })
      .then((response) => {
        event.notification.close();
      })
      .catch((error) => {
        event.notification.close();
        console.log(`Error marking notification as read: ${error}`);
      });
  } else {
    event.notification.close();
    event.waitUntil(clients.openWindow("https://www.calng.app"));
  }
});
