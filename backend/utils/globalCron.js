import { PrismaClient } from "@prisma/client";
import { sendNotification } from "./notificationService.js";
import cron from "node-cron";
const prisma = new PrismaClient();

export default processPushNotifications = async () => {
  console.log("Starting global Web Push cron job");
  try {
    const notificationIdsToUpdate = [];
    const usersWithNotificationSub = await prisma.user.findMany({
      where: {
        notifSub: {
          not: null,
        },
      },
      take: 1000,
    });
    for (const user of usersWithNotificationSub) {
      const currentTime = new Date();
      const notifications = await prisma.notification.findMany({
        where: {
          userId: user.id,
        },
      });
      for (const notification of notifications) {
      	if (new Date(notification.time) <= new Date()) {
        const payload = JSON.stringify({
          title: notification.notifData.title,
          body: notification.notifData.notes,
        });
        sendNotification(payload, JSON.parse(user.notifSub))
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
