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
  updateReminderSnooze,
  updateReminderAndNotificationSnooze,
  updateReminderTime,
  pauseAllRemindersInRepeatingGroup,
} from "../controllers/remindersController.js";

const reminderRouter = express.Router();

reminderRouter.get("/:username/reminders", auth, getReminders);
reminderRouter.patch("/:username/reminder/:reminderId");
reminderRouter.post("/new/reminder", auth, addNewReminder);
reminderRouter.patch("/update/reminder/complete", auth, updateReminderComplete);
reminderRouter.patch("/update/reminder/notes", auth, updateReminderNotes);
reminderRouter.patch("/update/reminder/title", auth, updateReminderTitle);
reminderRouter.patch("/update/reminder/snooze", auth, updateReminderSnooze);
reminderRouter.patch("/update/reminder/time", auth, updateReminderTime);
reminderRouter.patch(
  "/update/reminder/pause/all",
  auth,
  pauseAllRemindersInRepeatingGroup,
);
reminderRouter.patch(
  "/update/reminder/notification/snooze",
  auth,
  updateReminderAndNotificationSnooze,
);
reminderRouter.delete(
  "/:username/delete/reminder/:reminderId",
  auth,
  authorizeDelete("reminderId", prisma.reminder),
  deleteReminder,
);

export default reminderRouter;
