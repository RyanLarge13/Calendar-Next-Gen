// notificationService.js

import WebPush from "web-push";

WebPush.setVapidDetails(
  "mailto:ryanlarge@ryanlarge.dev",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function sendNotification(payload, subscriptions) {
  console.log(subscriptions);
  if (!subscriptions) {
    throw new Error("Subscription not set");
  }
  if (subscriptions.length < 2) {
    WebPush.sendNotification(subscriptions[0], payload).catch((error) => {
      console.error("Error sending notification:", error);
    });
  }
  if (subscriptions.length > 1) {
    subscriptions.forEach((sub) => {
      WebPush.sendNotification(JSON.parse(sub), payload).catch((error) => {
        console.error("Error sending notification:", error);
      });
    });
  }
}

export { sendNotification };
