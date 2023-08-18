import WebPush from "web-push";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

WebPush.setVapidDetails(
  "mailto:ryanlarge@ryanlarge.dev",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function sendNotification(payload, subscriptions, userId) {
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
        if (error.statusCode === 410) {
          const endpoint = sub.endpoint;
          prisma.user
            .update({
              where: { id: userId },
              data: {
                notifSub: {
                  set: {
                    endpoint: {
                      delete: endpoint,
                    },
                  },
                },
              },
            })
            .then((updatedUser) => {
              console.log(
                `Subscription with endpoint ${endpoint} has been deleted.`
              );
            })
            .catch((updateError) => {
              console.error("Error updating user:", updateError);
              // Handle the update error as needed.
            });
        }
      });
    });
  }
}

export { sendNotification };
