import prisma from "../utils/prismaClient.js";
import { sendNotification } from "../utils/notificationService.js";
import signToken from "../auth/signToken.js";
import cron from "node-cron";
const connectedClients = [];

export const subscribeToNotifications = async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { notifSub: { push: JSON.stringify(subscription) } },
    });
    if (updatedUser) {
      const payload = JSON.stringify({
        title: "Welcome!",
        body: "Thank you for subscribing to notifications with Calng!",
        data: {
          notifType: "system",
          time: new Date(),
        },
      });
      sendNotification(payload, [subscription]);
      const newSignture = signToken(updatedUser);
      return res.status(200).json({
        message: "Subscription received successfully and user updated",
        token: newSignture,
        user: updatedUser,
      });
    }
    if (!updatedUser) {
      return res
        .status(401)
        .json({ message: "Failed to update user, subscription still saved" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: `The server failed, I am terribly sorry for the inconvenience, please try to subscribe to notifications again by reloading the page. Error: ${err}`,
    });
  }
};

export const addSubscriptionToUser = async (req, res) => {
  const { id } = req.user;
  const newSubscription = req.body.sub;
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      notifSub: { push: JSON.stringify(newSubscription) },
    },
  });
  if (updatedUser) {
    const payload = JSON.stringify({
      title: "New Device",
      notifType: "system",
      body: `Notifications will now be sent this device as well ${updatedUser.username}`,
    });
    sendNotification(payload, [newSubscription]);
    const newSignture = signToken(updatedUser);
    return res.status(200).json({
      message: "Subscription received successfully and user updated",
      token: newSignture,
      user: updatedUser,
    });
  }
  if (!updatedUser) {
    return res
      .status(401)
      .json({ message: "Failed to update user, subscription still saved" });
  }
};

const processNotifications = async (userId, res) => {
  console.log("Processing notifications");
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        sentNotification: false,
        userId: userId,
      },
      take: 25,
    });
    let delay = 3000;
    const notificationIdsToUpdate = [];
    for (const notification of notifications) {
      if (new Date(notification.time) <= new Date()) {
        setTimeout(() => {
          sendSSEEventToClient(userId, notification);
        }, delay);
        delay += 3000;
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
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const clientResponse = res;
  const id = req.params.userId;
  if (id === undefined || id === null) {
    console.log("No id was passed through request");
    return res.end();
  }
  const existingClientIndex = connectedClients.findIndex(
    (client) => client.id === id
  );
  if (existingClientIndex !== -1) {
    const existingClient = connectedClients[existingClientIndex];
    console.log(
      `User is attempting reconnection with user id: ${existingClient.id}`
    );
    existingClient.response = clientResponse;
    existingClient.job.stop();
    const newJob = cron.schedule("*/15 * * * * *", () => {
      processNotifications(id, clientResponse);
    });
    existingClient.job = newJob;
    existingClient.job.start();
  }
  if (existingClientIndex === -1) {
    console.log("New client attempting connection");
    const newClient = { id: id, response: clientResponse };
    const newJob = cron.schedule("*/15 * * * * *", () => {
      processNotifications(id, clientResponse);
    });
    newClient.job = newJob;
    newClient.job.start();
    connectedClients.push(newClient);
  }
  req.on("close", () => {
    console.log("Closing connection");
    res.end();
    if (existingClientIndex !== -1) {
      const existingClient = connectedClients[existingClientIndex];
      existingClient.response.end();
      existingClient.job.stop();
      console.log(`Stopping SSE response for client ${existingClient.id}`);
    } else {
      console.log("No existing client but req.on close event fired");
    }
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
        message: "Successfully fetched notifications",
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

export const createNotification = async (req, res) => {
  const { notification } = req.body;
  try {
    const newNotif = await prisma.notification.create({
      data: notification,
    });
    if (newNotif) {
      res.status(201).json({
        message: "Successfully created your new notification",
        notification: newNotif,
      });
    }
    if (!newNotif) {
      res.status(401).json({
        message:
          "Failed to create a new Notification, please refresh and try again",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ message: `Server error, please refresh and try again: ${err}` });
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

export const markAsRead = async (req, res) => {
  const { notifId } = req.body;
  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: notifId },
      data: { read: true },
    });
    if (updatedNotification) {
      return res.status(200).json({
        message: "Notification marked as read",
        notif: updatedNotification,
      });
    } else {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return res.status(500).json({
      message: "An error occurred while marking the notification as read",
    });
  }
};

export const markAsUnRead = async (req, res) => {
  const { notifId } = req.body;
  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: notifId },
      data: { read: false },
    });
    if (updatedNotification) {
      return res.status(200).json({
        message: "Notification marked as un-read",
        notif: updatedNotification,
      });
    } else {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return res.status(500).json({
      message: "An error occurred while marking the notification as read",
    });
  }
};

export const deleteNotification = async (req, res) => {
  const notifId = req.params.notifId;
  try {
    const deletedCount = await prisma.notification.deleteMany({
      where: {
        id: notifId,
      },
    });
    if (deletedCount === 1) {
      return res.status(201).json({
        message: "Successfully deleted notification",
      });
    } else if (deletedCount === 0) {
      return res.status(400).json({
        message: "Notification not found, or it was already deleted",
      });
    } else {
      return res.status(500).json({
        message: "An error occurred while deleting the notification",
      });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the notification",
    });
  }
};
