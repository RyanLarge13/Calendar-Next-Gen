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
      data: { notifSub: { push: JSON.stringify(subscription) } },
    });
    if (updatedUser) {
      const payload = JSON.stringify({
        title: "Welcome!",
        body: "Thank you for subscribing to notifications with Calng!",
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
      message: `The server failed, I am terribly sorry for the inconveniece, please try to subscribe to notifications again by reloading the page. Error: ${err}`,
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
    const notificationIdsToUpdate = [];
    for (const notification of notifications) {
      if (new Date(notification.time) <= new Date()) {
        sendSSEEventToClient(userId, notification);
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
    existingClient.response = clientResponse;
    existingClient.job.stop();
    const newJob = cron.schedule("*/15 * * * * *", () => {
      processNotifications(id, clientResponse);
    });
    existingClient.job = newJob;
    existingClient.job.start();
  }
  if (existingClientIndex === -1) {
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
    if (existingClientIndex !== -1) {
      const existingClient = connectedClients[existingClientIndex];
      existingClient.response.end();
      existingClient.job.stop();
      console.log(`Stopping SSE response for client ${existingClient.id}`);
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

export const markAsRead = async () => {
	const notificationId = req.body.notificationId;
	try {
	await prisma.notification.update({
		where: {id: notificationId}, 
		data: {read: true} 
	})
	} catch (err) {
		console.log(err)
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
