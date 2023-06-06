import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  deleteNotification,
  getNotifications,
  getOldNotifications,
  updateNotification,
} from "../controllers/notificationsController.js";

const notifRouter = express.Router();

notifRouter.get("/:username/notifications", getNotifications);
notifRouter.get("/:username/notifs", auth, getOldNotifications);
notifRouter.patch("/:username/update/notif", auth, updateNotification);
notifRouter.delete("/notification/:notifId", auth, deleteNotification);

export default notifRouter;
