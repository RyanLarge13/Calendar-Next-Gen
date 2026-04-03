import WebPush from "web-push";
import prisma from "./prismaClient.js";

WebPush.setVapidDetails(
  "mailto:ryanlarge@ryanlarge.dev",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

const sendNotification = (payload, subscriptions, userId) => {
  if (!subscriptions) {
    console.log(
      `Attempting to send notification but cancelled early. No existing subscriptions for user ${userId}`,
    );
    return;
  }
  if (subscriptions.length < 2) {
    WebPush.sendNotification(subscriptions[0], payload).catch((error) => {
      console.error("Error sending notification:", error);
    });
  }
  if (subscriptions.length > 1) {
    subscriptions.forEach((sub) => {
      try {
        const parsedSub = JSON.parse(sub);

        if (parsedSub.paused) {
          return;
        }

        if (
          payload?.data?.deviceExceptions?.length > 0 &&
          payload?.data?.deviceExceptions?.includes(parsedSub.endpoint)
        ) {
          return;
        }
      } catch (err) {
        console.log(
          "Error parsing subscription object pre-sending webpush notifications",
        );
        console.log(err);
      }
      WebPush.sendNotification(JSON.parse(sub), payload).catch(
        async (error) => {
          console.error("Error sending notification:", error);
          if (error.statusCode === 410) {
            const parsedSub = JSON.parse(sub);
            const endpointToDelete = parsedSub.endpoint;
            const user = await prisma.user.findUnique({
              where: { id: userId },
            });
            const updatedNotifSub = user.notifSub
              .map((subscription) => JSON.parse(subscription))
              .filter(
                (parsedSubscription) =>
                  parsedSubscription.endpoint !== endpointToDelete,
              );
            const updatedNotifSubStringified = updatedNotifSub.map(
              (subscription) => JSON.stringify(subscription),
            );
            await prisma.user.update({
              where: { id: userId },
              data: {
                notifSub: updatedNotifSubStringified,
              },
            });
          }
        },
      );
    });
  }
};

export { sendNotification };
