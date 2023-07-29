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
} from "../controllers/notificationsController.js";

const notifRouter = express.Router();

notifRouter.get("/:userId/notifications", getNotifications);
notifRouter.get("/:username/notifs", auth, getOldNotifications);
notifRouter.post("/subscribe/notifs", auth, subscribeToNotifications);
notifRouter.post("/add/subscription", auth, addSubscriptionToUser)
notifRouter.post("/mark-as-read", markAsRead)
notifRouter.patch("/:username/update/notif", auth, updateNotification);
notifRouter.delete("/notification/:notifId", auth, deleteNotification);

export default notifRouter;
