import express from "express";
import auth from "../auth/authenticateToken.js";
import { getNotifications, subscribe } from "../controllers/notificationsController.js";

const notifRouter = express.Router();

notifRouter.get("/:username/notifications", getNotifications);
notifRouter.post("/subscribe/notifications", auth, subscribe)

export default notifRouter;
