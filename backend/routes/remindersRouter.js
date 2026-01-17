import express from "express";
import prisma from "../utils/prismaClient.js";
import auth from "../auth/authenticateToken.js";
import authorizeDelete from "../middleware/authorizeDelete.js";
import {
  addNewReminder,
  getReminders,
  deleteReminder,
  updateReminderComplete,
  updateReminderNotes,
  updateReminderTitle,
} from "../controllers/remindersController.js";

const reminderRouter = express.Router();

reminderRouter.get("/:username/reminders", auth, getReminders);
reminderRouter.patch("/:username/reminder/:reminderId");
reminderRouter.post("/new/reminder", auth, addNewReminder);
reminderRouter.patch("/update/reminder/complete", auth, updateReminderComplete);
reminderRouter.patch("/update/reminder/notes", auth, updateReminderNotes);
reminderRouter.patch("/update/reminder/title", auth, updateReminderTitle);
reminderRouter.delete(
  "/:username/delete/reminder/:reminderId",
  auth,
  authorizeDelete("reminderId", prisma.reminder),
  deleteReminder
);

export default reminderRouter;
