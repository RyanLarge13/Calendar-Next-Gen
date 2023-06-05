import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  getNotifications,
  subscribe,
  getOldNotifications,
  updateNotification,
} from "../controllers/notificationsController.js";

const notifRouter = express.Router();

notifRouter.get("/:username/notifications", getNotifications);
notifRouter.get("/:username/notifs", auth, getOldNotifications);
notifRouter.patch("/:username/update/notif", auth, updateNotification);
notifRouter.post("/subscribe/notifications", auth, subscribe);

export default notifRouter;
