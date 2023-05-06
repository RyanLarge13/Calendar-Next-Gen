import express from "express";
import auth from "../auth/authenticateToken.js";
import { getEvents } from "../controllers/eventsController.js";

const eventsRouter = express.Router();

eventsRouter.get("/:username/events", auth, getEvents);

export default eventsRouter;
