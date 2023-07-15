import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (error) {
      payload = { title: "Notification", body: event.data.text() };
    }
  } else {
    payload = { title: "Notification", body: "Default notification message" };
  }
  const { title, body } = payload;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "./favicon.svg",
      badge: "./favicon.svg",
      vibrate: [200, 100, 200],
      actions: [{ action: "mark-as-read", title: "Mark as Read" }],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  if (event.action === "mark-as-read") {
  	return console.log("trying something new!")
    fetch("https://yourapi.com/mark-as-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: event.notification.data.notificationId,
      }),
    })
      .then((response) => {
        event.notification.close();
        // Handle the API response as needed
      })
      .catch((error) => {
        console.log(`Error marking notification as read: ${error}`);
      });
  } else {
    event.notification.close();
    event.waitUntil(clients.openWindow("https://yourapp.com"));
  }
});
