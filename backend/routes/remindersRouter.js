import express from "express";
import auth from "../auth/authenticateToken.js";
import { addNewReminder } from "../controllers/remindersController.js";

const reminderRouter = express.Router();

reminderRouter.get("");
reminderRouter.post("/new/reminder", auth, addNewReminder);

export default reminderRouter;
