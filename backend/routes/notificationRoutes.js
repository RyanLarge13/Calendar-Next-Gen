import express from "express";
import { getNotifications } from "../controllers/notificationsController.hs";

const notifRouter = express.Router();

notifRouter.route("/notifications", auth, getNotifications);

export default notifRouter