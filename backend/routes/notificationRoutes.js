import express from "express";
import auth from "../auth/authenticateToken.js";
import { getNotifications } from "../controllers/notificationsController.js";

const notifRouter = express.Router();

notifRouter.get("/:username/notifications", auth, getNotifications);

export default notifRouter;
