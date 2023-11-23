import express from "express";
import prisma from "../utils/prismaClient.js"
import auth from "../auth/authenticateToken.js";
import authorizeDelete from "../middleware/authorizeDelete.js"
import {
  addNewReminder,
  getReminders,
  deleteReminder
} from "../controllers/remindersController.js";

const reminderRouter = express.Router();

reminderRouter.get("/:username/reminders", auth, getReminders);
reminderRouter.patch("/:username/reminder/:reminderId");
reminderRouter.post("/new/reminder", auth, addNewReminder);
reminderRouter.delete("/:username/delete/reminder/:reminderId", auth, authorizeDelete("reminderId", prisma.reminder), deleteReminder);

export default reminderRouter;
