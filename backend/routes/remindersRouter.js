import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  addNewReminder,
  getReminders,
  deleteReminder
} from "../controllers/remindersController.js";

const reminderRouter = express.Router();

reminderRouter.get("/:username/reminders", auth, getReminders);
reminderRouter.patch("/:username/reminder/:reminderId");
reminderRouter.post("/new/reminder", auth, addNewReminder);
reminderRouter.delete("/:username/delete/reminder/:reminderId", auth, deleteReminder);

export default reminderRouter;
