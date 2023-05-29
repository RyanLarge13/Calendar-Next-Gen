import express from "express";
import auth from "../auth/authenticateToken.js";
import { getNotifications } from "../controllers/notificationsController.js";

const notifRouter = express.Router();

notifRouter.get("/:username/notifications", getNotifications);

export default notifRouter;
