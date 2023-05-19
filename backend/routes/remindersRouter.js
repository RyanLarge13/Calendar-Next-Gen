import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  addNewReminder,
  getReminders,
} from "../controllers/remindersController.js";

const reminderRouter = express.Router();

reminderRouter.get("/:username/reminders", auth, getReminders);
reminderRouter.patch("/:username/reminder/:reminderId");
reminderRouter.post("/new/reminder", auth, addNewReminder);

export default reminderRouter;
