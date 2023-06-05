import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import webpush from "web-push";
import cron from "node-cron";
let subscription;
webpush.setVapidDetails(
  "mailto:test@test.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendNotification = async (notif) => {
  const payload = {
    title: notif.notifData.title,
    notes: notif.notifData.notes,
  };
  await webpush
    .sendNotification(subscription, JSON.stringify(payload))
    .catch((err) => console.log(err));
};

export const subscribe = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const { sub } = req.body;
  subscription = JSON.parse(sub);
  res
    .status(201)
    .json({ message: "You have successfully subscribed to notifications" });
};

const processNotifications = async (userId, res) => {
  console.log("Processing");
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        sentNotification: false,
        userId,
      },
      take: 25,
    });
    const notificationIdsToUpdate = [];
    for (const notification of notifications) {
      if (new Date(notification.time) <= new Date()) {
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
        await sendNotification(notification);
        notificationIdsToUpdate.push(notification.id);
      }
    }
    if (notificationIdsToUpdate.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: notificationIdsToUpdate } },
        data: { sentNotification: true },
      });
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

export const getNotifications = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const id = req.params.userId;
  const job = cron.schedule("*/30 * * * * *", () => {
    processNotifications(id, res);
  });
  job.start();
  req.on("close", () => {
    console.log("Closing");
    job.stop();
    res.end();
  });
};

export const getOldNotifications = async (req, res) => {
  const userId = req.user.id;
  const notifications = await prisma.notification.findMany({
    where: {
      sentNotification: true,
      userId,
    },
  });
  if (notifications) {
    res.status(200).json({
      message: "Succesfully fetched notifications",
      notifs: notifications,
    });
  }
  if (!notifications) {
    res.status(401).json({ message: "Failed to fetch notifications" });
  }
};

export const updateNotification = async (req, res) => {
  const ids = req.body.notifs;
  const userId = req.user.id;
  const update = await prisma.notification.updateMany({
    where: { id: { in: ids }, userId },
    data: { read: true },
  });
  if (update) {
    res.status(201).json({ message: "Successfully updated notifications" });
  }
  if (!update) {
    res.status(401).json({ message: "Error updating notifications" });
  }
};
