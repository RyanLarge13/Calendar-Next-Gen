import { PrismaClient } from "@prisma/client";
import { sendNotification } from "./notificationService.js";
const prisma = new PrismaClient();

const processPushNotifications = async () => {
  console.log("Processing global user notifications");
  try {
    const notificationIdsToUpdate = [];
    const usersWithNotificationSub = await prisma.user.findMany({
      where: {
        NOT: {
          notifSub: {
            equals: null,
          },
        },
        NOT: {
          notifSub: {
            isEmpty: true,
          },
        },
      },
      take: 1000,
    });
    for (const user of usersWithNotificationSub) {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: user.id,
          sentWebPush: false,
        },
      });
      for (const notification of notifications) {
        if (new Date(notification.time) <= new Date()) {
          const payload = JSON.stringify({
            title: notification.notifData.title,
            body: notification.notifData.notes,
            data: {
              id: notification.id,
              userId: notification.userId,
              time: notification.time,
              notifType: notification.type,
            },
          });
          if (user.notifSub.length > 1) {
            sendNotification(payload, [...user.notifSub], user.id);
          }
          if (user.notifSub.length < 2) {
            sendNotification(payload, [JSON.parse(...user.notifSub)]);
          }
          notificationIdsToUpdate.push(notification.id);
        }
      }
    }
    if (notificationIdsToUpdate.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: notificationIdsToUpdate } },
        data: { sentWebPush: true },
      });
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

export default processPushNotifications;
