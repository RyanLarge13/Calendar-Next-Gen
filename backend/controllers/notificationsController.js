import prisma from "../utils/prismaClient.js";
import { sendNotification } from "../utils/notificationService.js";
import signToken from "../auth/signToken.js";
const connectedClients = [];

const checkForExistingSubscriptionOnUser = (existingNotifSubs, newEndpoint) => {
  const userHasEndpoint = existingNotifSubs.some((s) => {
    try {
      const sub = JSON.parse(s);

      const subEndpoint = sub?.endpoint || "";

      if (subEndpoint === newEndpoint) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("Parsing users stored subscription objects are failing");
      console.log(err);
    }
  });

  if (userHasEndpoint) {
    return true;
  } else {
    return false;
  }
};

export const subscribeToNotifications = async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      res.status(404).json({ message: "Please login" });
      return;
    }

    const existingNotifSubs = existingUser.notifSub;

    const newEndpoint = subscription?.endpoint;

    if (!newEndpoint) {
      res
        .status(400)
        .json({ message: "Please send a valid subscription to the server" });
      return;
    }

    const userHasEndpoint = checkForExistingSubscriptionOnUser(
      existingNotifSubs,
      newEndpoint,
    );

    if (userHasEndpoint) {
      res.status(400).json({
        message:
          "This user already has a subscription with this endpoint stored on the server",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { notifSub: { push: JSON.stringify(subscription) } },
    });
    if (updatedUser) {
      const payload = JSON.stringify({
        title: "Welcome!",
        body: "You are subscribed to notifications with CNG",
        data: {
          notifType: "system",
          time: new Date(),
        },
      });
      sendNotification(payload, [subscription], userId);
      const userToSign = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
      };
      const newSignature = signToken(userToSign);
      return res.status(200).json({
        message: "Subscription received successfully and user updated",
        token: newSignature,
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
  let newSubscription;
  try {
    newSubscription = JSON.parse(req.body.sub);
  } catch (err) {
    console.log(
      "Error parsing subscription object user sent from frontend when trying to add notification subscription to user",
    );
    console.log(err);
    console.log(newSubscription);
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: id },
  });
  if (!existingUser) {
    res.status(404).json({ message: "Please login" });
    return;
  }

  const existingNotifSubs = existingUser.notifSub;

  const newEndpoint = newSubscription?.endpoint;

  if (!newEndpoint) {
    res
      .status(400)
      .json({ message: "Please send a valid subscription to the server" });
    return;
  }

  const userHasEndpoint = checkForExistingSubscriptionOnUser(
    existingNotifSubs,
    newEndpoint,
  );

  if (userHasEndpoint) {
    res.status(400).json({
      message:
        "This user already has a subscription with this endpoint stored on the server",
    });
    return;
  }

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
      body: `Notifications will now be sent to this device as well ${updatedUser.username}`,
      data: {
        notifType: "system",
        time: new Date(),
      },
    });
    sendNotification(payload, [newSubscription], id);
    const userToSign = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
    };
    const newSignature = signToken(userToSign);
    return res.status(200).json({
      message: "Subscription received successfully and user updated",
      token: newSignature,
      user: updatedUser,
    });
  }
  if (!updatedUser) {
    return res
      .status(401)
      .json({ message: "Failed to update user, subscription still saved" });
  }
};

export const removeSubscriptionToDevice = async (req, res) => {
  const { newSubs } = req.body;
  const user = req.user;

  if (!Array.isArray(newSubs) || !newSubs) {
    console.log("No new subscription object was sent to the server to update");
    console.log(newSubs);
    res.status(400).json({
      message:
        "Please provide new subscription list for the subscriptions you would like to update",
    });
    return;
  }

  if (!user) {
    res.status(400).json({
      message: "You are not authorized to make this request. Please login",
    });
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: { notifSub: newSubs },
    });

    res.status(201).json({ message: "Subscription successfully deleted" });
    return;
  } catch (err) {
    console.log(
      "Error removing notification subscription from users data in DB via a patch update",
    );
    console.log(err);
  }
};

const pauseAllNotifications = async (req, res) => {
  const user = req.user;

  if (!user) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  let userInfo = null;

  try {
    userInfo = await prisma.user.findUnique({ where: { id: user.id } });
  } catch (err) {
    console.log("Error calling prisma find unique for user");
    console.log(err);
  }

  if (!userInfo) {
    res.status(404).json({
      message: "YCannot find user information. User does not seem to exist",
    });
    return;
  }

  let newNotifSubs;

  try {
    newNotifSubs = userInfo.notifSub.map((s) => {
      const subObj = JSON.parse(s);
      const newSub = { ...subObj, paused: true };
      return newSub;
    });

    const stringWorthySubs = newNotifSubs.map((s) => JSON.stringify(s));

    await prisma.user.update({
      where: { id: id },
      data: { notifSub: stringWorthySubs },
    });

    res.status(201).json({
      message: "Successfully paused all users notification subscriptions",
    });
  } catch (err) {
    console.log("Error parsing users notifications subscriptions objects");
    console.log(err);
  }
};

const processingUsers = new Set();
const processNotifications = async (userId) => {
  if (processingUsers.has(userId)) return;
  processingUsers.add(userId);
  try {
    const pending = await prisma.notification.findMany({
      where: { userId, sentNotification: false, time: { lte: new Date() } },
      orderBy: { time: "asc" },
      take: 25,
    });
    for (const notification of pending) {
      const frame = `id: ${notification.id}\ndata: ${JSON.stringify(notification)}\n\n`;
      let delivered = false;
      for (const client of connectedClients.filter((c) => c.id === userId)) {
        if (client.response.destroyed || client.response.writableEnded) continue;
        try {
          client.response.write(frame);
          delivered = true;
        } catch (error) {
          console.warn("SSE write failed:", error);
        }
      }
      if (delivered) {
        await prisma.notification.updateMany({
          where: { id: notification.id, userId, sentNotification: false },
          data: { sentNotification: true },
        });
      }
    }
  } catch (error) {
    console.error("Error delivering notifications:", error);
  } finally {
    processingUsers.delete(userId);
  }
};

// One shared poller for all active users instead of one cron job per tab.
const notificationPoller = setInterval(() => {
  for (const id of new Set(connectedClients.map((client) => client.id))) {
    void processNotifications(id);
  }
}, 15000);
notificationPoller.unref?.();

export const getNotifications = async (req, res) => {
  const id = req.params.userId;
  if (!id) return res.status(400).end();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders?.();
  res.write("retry: 5000\n\n");

  // Each request owns its response and cleanup. Never close a replacement
  // connection when the previous request disconnects.
  const client = { id, response: res };
  connectedClients.push(client);
  const heartbeat = setInterval(() => {
    if (!res.destroyed && !res.writableEnded) res.write(": heartbeat\n\n");
  }, 25000);
  heartbeat.unref?.();

  const cleanup = () => {
    clearInterval(heartbeat);
    const index = connectedClients.indexOf(client);
    if (index !== -1) connectedClients.splice(index, 1);
  };
  res.on("close", cleanup);
  res.on("error", cleanup);
  void processNotifications(id);
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

export const updateLastSeenOnDevice = async (req, res) => {
  const user = req.user;
  const { newSubs } = req.body;

  if (!user) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!Array.isArray(newSubs) || !newSubs) {
    res.status(404).json({
      message: "Please provide a notification subscription endpoint to update",
    });
    return;
  }

  // each new sub was stringified on frontend before sending through
  try {
    await prisma.user.update({
      where: { id: user.userId },
      data: { notifSub: newSubs },
    });

    res
      .status(200)
      .json({ message: "Successfully updated your subscriptions" });
  } catch (err) {
    console.log(
      "Error trying to update the last seen field in notifSub for the user in the DB",
    );
    console.log(err);
  }
};

export const updateNotificationSnooze = async (req, res) => {
  const user = req.user;
  const { notifId, newTime } = req.body;

  if (!user) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!notifId || !newTime) {
    res.status(404).json({
      message: "Please provide a notification to snooze",
    });
    return;
  }

  try {
    await prisma.notification.update({
      where: { id: notifId },
      data: {
        read: false,
        time: newTime,
        sentWebPush: false,
        sentNotification: false,
      },
    });

    res.status(200).json({ message: "Successfully updated your notification" });
  } catch (err) {
    console.log("Error updating notification snooze on server");
    console.log(err);
    res
      .status(500)
      .json({ message: "Error updating notification snooze on server" });
  }
};
