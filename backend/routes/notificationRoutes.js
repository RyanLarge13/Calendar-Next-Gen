import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  subscribeToNotifications,
  deleteNotification,
  getNotifications,
  getOldNotifications,
  updateNotification,
  addSubscriptionToUser,
  markAsRead,
  createNotification,
  markAsUnRead,
  removeSubscriptionToDevice,
  updateLastSeenOnDevice,
} from "../controllers/notificationsController.js";

const notifRouter = express.Router();

notifRouter.get("/:userId/notifications", getNotifications);
notifRouter.get("/:username/notifs", auth, getOldNotifications);
notifRouter.post("/subscribe/notifs", auth, subscribeToNotifications);
notifRouter.post("/add/subscription", auth, addSubscriptionToUser);
notifRouter.patch("/remove/subscription", auth, removeSubscriptionToDevice);
notifRouter.post("/mark-as-read", markAsRead);
notifRouter.post("/mark-as-unread", markAsUnRead);
notifRouter.post("/new/notification", auth, createNotification);
notifRouter.patch("/:username/update/notif", auth, updateNotification);
notifRouter.patch("/notif/lastseen", auth, updateLastSeenOnDevice);

// One delete is from user frontend app other is for service worker
notifRouter.delete("/notification/:notifId", auth, deleteNotification);
notifRouter.delete("/delete-notif/notification/:notifId", deleteNotification);

export default notifRouter;
