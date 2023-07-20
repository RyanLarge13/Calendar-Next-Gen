// notificationService.js

import WebPush from "web-push";

WebPush.setVapidDetails(
  "mailto:ryanlarge@ryanlarge.dev",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function sendNotification(payload, subscription) {
  if (!subscription) {
    throw new Error("Subscription not set");
  }
  WebPush.sendNotification(subscription, payload).catch((error) => {
    console.error("Error sending notification:", error);
  });
}

export { sendNotification };
