import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
 /^https:\/\/calendar-next-gen-production\.up\.railway\.app\/user\/data/,
 new NetworkFirst({ cacheName: "api-cache" })
);

const formatDbText = text => {
 if (typeof text !== "string") {
  return "";
 }
 const delimiter = "|||";
 if (text.includes(delimiter)) {
  const formattedText = text
   .split(delimiter)
   .map(part => part.trim())
   .join("\n");
  return formattedText;
 } else {
  return text.trim();
 }
};

self.addEventListener("fetch", event => {
 console.log("sw fetch event");
 const url = new URL(event.request.url);
 console.log(`url: ${url}`);
 if (url.pathname.startsWith("/new/")) {
  console.log("url starts with /new/");
  event.respondWith(async () => {
   const allClients = await clients.matchAll({ type: "window" });
   console.log(`Opening app sessions: ${allClients}`);
   if (allClients.length === 0) {
    const newClient = await clients.openWindow("/");
    if (newClient) {
     console.log("Posting message to new client");
     newClient.postMessage({ action: url.pathname });
    }
   } else {
    console.log("Posting message to existing client");
    allClients[0].focus();
    allClients[0].postMessage({ action: url.pathname });
   }
   return new Response("Completed client instance and message", {
    headers: {"Content-Type": "text/plain"}
   });
  })();
 }
});

self.addEventListener("push", event => {
 let payload = {};
 if (event.data) {
  try {
   payload = event.data.json();
  } catch (error) {
   payload = {
    title: "Notification",
    body: event.data.text()
   };
  }
 } else {
  payload = {
   title: "were so sorry",
   body:
    "An issue occurred sending the correct notification data, please refresh & try again"
  };
 }
 const { title, body, data } = payload;
 const { notifType, time } = data;
 if (notifType === "event") {
  return event.waitUntil(
   self.registration.showNotification(title, {
    body: `${formatDbText(body || "")} \n ${new Date(time).toLocaleTimeString(
     "en-US"
    )}`,
    data,
    icon: "./favicon.svg",
    badge: "./badge.svg",
    vibrate: [100, 100, 100],
    actions: [
     { action: "delete-notif", title: "Delete", type: "button" },
     { action: "mark-as-read", title: "Mark as Read", type: "button" },
     { action: "open-app", title: "Open App", type: "button" }
    ]
   })
  );
 }
 if (notifType === "reminder") {
  return event.waitUntil(
   self.registration.showNotification(title, {
    body: `${formatDbText(body || "")} \n @${new Date(time).toLocaleTimeString(
     "en-US"
    )}`,
    data,
    icon: "./favicon.svg",
    badge: "./badge.svg",
    vibrate: [100, 100, 100],
    actions: [
     { action: "delete-notif", title: "Delete", type: "button" },
     { action: "mark-as-read", title: "Mark as Read", type: "button" },
     { action: "open-app", title: "Open App", type: "button" }
    ]
   })
  );
 }
 if (notifType === "system") {
  return event.waitUntil(
   self.registration.showNotification(title, {
    body: `${formatDbText(body || "")} \n @${new Date(time).toLocaleTimeString(
     "en-US"
    )}`,
    data,
    icon: "./favicon.svg",
    badge: "./badge.svg",
    vibrate: [100, 100, 100],
    actions: [
     { action: "close-notif", title: "Close", type: "button" },
     { action: "open-app", title: "Open App", type: "button" }
    ]
   })
  );
 }
});

const openApp = event => {
 event.notification.close();
 event.waitUntil(
  clients
   .matchAll({
    type: "window",
    includeUncontrolled: true
   })
   .then(clientList => {
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

self.addEventListener("notificationclick", event => {
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
  fetch("https://calendar-next-gen-production.up.railway.app/mark-as-read", {
   method: "POST",
   headers: {
    "Content-Type": "application/json"
   },
   body: JSON.stringify({
    notifId: notifId
   })
  })
   .then(() => {
    event.notification.close();
   })
   .catch(error => {
    event.notification.close();
    console.log(`Error marking notification as read: ${error}`);
   });
 }
 if (event.action === "delete-notif") {
  event.notification.close();
  fetch(
   `https://calendar-next-gen-production.up.railway.app/delete-notif/notification/${notifId}`,
   {
    method: "DELETE",
    headers: {
     "Content-Type": "application/json"
    },
    body: JSON.stringify({
     notifId: notifId
    })
   }
  )
   .then(() => {
    event.notification.close();
   })
   .catch(error => {
    event.notification.close();
    console.log(`Error marking notification as read: ${error}`);
   });
 } else {
  openApp(event);
 }
});

self.addEventListener("message", event => {
 if (event.data && event.data.type === "SKIP_WAITING") {
  self.skipWaiting();
 }
 if (event.data && event.data.command === "closeNotifications") {
  closeOpenNotifications();
 }
});

const closeOpenNotifications = () => {
 // Get a list of open notifications
 self.registration.getNotifications().then(notifications => {
  notifications.forEach(notification => {
   notification.close();
  });
 });
};

//backgorun and periodic sync
self.addEventListener("sync", event => {
 if (event.tag === "background-sync") {
  event.waitUntil(backgroundSync()); // Call your sync function
 }
});

self.addEventListener("periodicsync", event => {
 if (event.tag === "periodic-sync") {
  event.waitUntil(periodicSync()); // Call your periodic sync function
 }
});

const backgroundSync = () => {};

const periodicSync = () => {};
