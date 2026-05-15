import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import {
  backgroundSync,
  periodicSync,
} from "./serviceWorkerModules/backgroundAndPeriodicSyncSW";
import {
  closeOpenNotifications,
  handleDeleteNotif,
  handleMarkAsRead,
  handleOpenApp,
} from "./serviceWorkerModules/notificationHandling";
import {
  grabFreshCache,
  interceptUserData,
} from "./serviceWorkerModules/cacheHandling";
import {
  getPayload,
  sendNotification,
} from "./serviceWorkerModules/sendNotifications";

const productionUrl = "https://calendar-next-gen-production.up.railway.app";

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

// Install redundant at the moment from use of workbox and VitePWA config automatically handling static assets
// self.addEventListener("install", event => {});

// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [
//     "user-cache",
//     "root-cache",
//     "css-cache",
//     "js-cache",
//     "html-cache",
//   ];
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
//   event.waitUntil(self.clients.claim());
// });

// Custom url interceptions
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/user/data")) {
    interceptUserData(event);
  }
  if (event.request.url.includes("/fresh")) {
    grabFreshCache(event);
  }
});

self.addEventListener("push", (event) => {
  const payload = getPayload(event);

  const { title, body, data } = payload;
  const { notifType, time } = data;

  switch (notifType) {
    case "event":
      sendNotification(
        event,
        "./event-icon.svg",
        [300, 100, 300, 100, 300],
        [
          { action: "delete-notif", title: "Delete", type: "button" },
          { action: "mark-as-read", title: "Mark as Read", type: "button" },
          { action: "open-app", title: "Open App", type: "button" },
        ],
        payload,
      );
      break;
    case "reminder":
      sendNotification(
        event,
        "./rem-icon.svg",
        [300, 120, 300, 120, 500, 200, 700],
        [
          { action: "delete-notif", title: "Delete", type: "button" },
          { action: "mark-as-read", title: "Mark as Read", type: "button" },
          { action: "open-app", title: "Open App", type: "button" },
        ],
        payload,
      );
      break;
    case "system":
      sendNotification(
        event,
        "./sys-icon.svg",
        [250, 100, 250],
        [
          { action: "close-notif", title: "Close", type: "button" },
          { action: "open-app", title: "Open App", type: "button" },
        ],
        payload,
      );
      break;
    default:
      break;
  }
});

self.addEventListener("notificationclick", (event) => {
  event.preventDefault();

  const action = event.action;

  switch (action) {
    case "close-notif":
      event.notification.close();
      break;
    case "open-app":
      event.waitUntil(handleOpenApp(event));
      break;
    case "mark-as-read":
      event.waitUntil(handleMarkAsRead(event));
      break;
    case "delete-notif":
      event.waitUntil(handleDeleteNotif(event));
      break;
    default:
      event.notification.close();
      break;
  }
});

self.addEventListener("message", async (event) => {
  if (event.data) {
    const type = event.data.type;

    switch (type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      case "close-notifications":
        closeOpenNotifications();
        break;
      default:
        break;
    }
  }
});

//background and periodic sync
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(backgroundSync());
  }
});

self.addEventListener("periodicsync", async (event) => {
  if (event.tag === "periodic-sync") {
    event.waitUntil(periodicSync());
  }
});
