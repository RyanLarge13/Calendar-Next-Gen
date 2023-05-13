import express from "express";
import auth from "../auth/authenticateToken.js";
import { getEvents, addEvent } from "../controllers/eventsController.js";

const eventsRouter = express.Router();

eventsRouter.get("/:username/events", auth, getEvents);
eventsRouter.post("/new/event", auth, addEvent);

export default eventsRouter;
