import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getNotifications = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const {id} = req.user
  cron.schedule("* * * * *", async () => {
    try {
      const notifications = await prisma.notification.findMany({
        reminderTime: { $lte: new Date() },
        sentNotification: false,
        userId: id
      });
      notifications.forEach(async (notif) => {
        //await sendReminderNotification(reminder);
        notif.sentNotification = true;
        await notif.save();
        res.write(`data: ${JSON.stringify(notif)}\n\n`);
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });
  req.on("close", () => {
    res.end();
  });
};
