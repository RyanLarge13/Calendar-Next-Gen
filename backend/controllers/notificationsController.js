import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
const prisma = new PrismaClient();

export const getNotifications = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const id = req.params.userId;
  cron.schedule("*/30 * * * * *", async () => {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          sentNotification: false,
          userId: id,
        },
      });
      notifications.map(async (notif) => {
        if (new Date(notif.time) <= new Date()) {
          res.write(`data: ${JSON.stringify(notif)}\n\n`);
          console.log(notif);
        }
      });
      await prisma.notification.updateMany({
        where: {
          sentNotification: false,
          userId: id,
        },
        data: { sentNotification: true },
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });
  req.on("close", () => {
    console.log("Closing");
    res.end();
  });
};
