import { PrismaClient } from "@prisma/client";
import { sendNotification } from "../utils/notificationService.js";
import signToken from "../auth/signToken.js"; 
import cron from "node-cron";
const prisma = new PrismaClient();
const connectedClients = [];

export const subscribeToNotifications = async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { notifSub: JSON.stringify(subscription) },
    });
    if (updatedUser) {
      const payload = JSON.stringify({
        title: "Welcome!",
        body: "Thank you for subscribing to notifications with Calng!",
      });
      sendNotification(payload, subscription);
        const newSignture = signToken(exsistingUser);
      return res.status(200).json({
        message: "Subscription received successfully and user updated",
        token: newSignture
      });
    }
    if (!updatedUser) {
      return res
        .status(401)
        .json({ message: "Failed to update user, subscription still saved" });
    }
  } catch {
    return res.status(401).json({
      message:
        "The server failed, I am terribly sorry for the inconveniece, please try to subscribe to notifications again by reloading the page",
    });
  }
};

const processNotifications = async (userId, res) => {
  console.log("Processing notifications");
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return res
        .status(401)
        .json({ message: "Error finding user, please refresh" });
    if (user) {
      const subscription = user.notifSub;
      const notifications = await prisma.notification.findMany({
        where: {
          sentNotification: false,
          userId: userId,
        },
        take: 25,
      });
      const notificationIdsToUpdate = [];
      for (const notification of notifications) {
        if (new Date(notification.time) <= new Date()) {
          sendSSEEventToClient(userId, notification);
          const payload = JSON.stringify({
            title: notification.notifData.title,
            body: notification.notifData.notes,
          });
          sendNotification(payload, subscription);
          notificationIdsToUpdate.push(notification.id);
        }
      }
      if (notificationIdsToUpdate.length > 0) {
        await prisma.notification.updateMany({
          where: { id: { in: notificationIdsToUpdate } },
          data: { sentNotification: true },
        });
      }
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

function sendSSEEventToClient(clientId, eventData) {
  const client = connectedClients.find((c) => c.id === clientId);
  if (client) {
    client.response.write(`data: ${JSON.stringify(eventData)}\n\n`);
  }
}

export const getNotifications = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const clientResponse = res;
  const id = req.params.userId;
  const client = { id: id, response: clientResponse };
  connectedClients.push(client);
  const job = cron.schedule("*/30 * * * * *", () => {
    processNotifications(id, clientResponse);
  });
  job.start();
  req.on("close", () => {
    res.end();
    return job.stop();
    setTimeout(() => {
      clientResponse.write(`Attempting SSE event after reconnection\n\n`);
    }, 5000);
  });
};

export const getOldNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        sentNotification: true,
        userId: userId,
      },
    });
    if (notifications) {
      res.status(200).json({
        message: "Succesfully fetched notifications",
        notifs: notifications,
      });
    }
    if (!notifications) {
      res.status(401).json({ message: "No notifications to fetch" });
    }
  } catch (err) {
    res.status(401).json({ message: "Failed to fetch notifications" });
  }
};

export const updateNotification = async (req, res) => {
  const ids = req.body.notifs;
  const userId = req.user.id;
  const update = await prisma.notification.updateMany({
    where: { id: { in: ids }, userId: userId },
    data: { read: true },
  });
  if (update) {
    res.status(201).json({ message: "Successfully updated notifications" });
  }
  if (!update) {
    res.status(401).json({ message: "Error updating notifications" });
  }
};

export const deleteNotification = async (req, res) => {
  const notifId = req.params.notifId;
  const deletedNotif = await prisma.notification.delete({
    where: {
      id: notifId,
    },
  });
  if (deletedNotif) {
    return res.status(201).json({
      message: "Successfully deleted notification",
      notif: deletedNotif,
    });
  }
  if (!deletedNotif) {
    return res
      .status(400)
      .json({ message: "There was an error deleting your notification" });
  }
};
