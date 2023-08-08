import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  getEvents,
  getAttachments,
  addEvent,
  deleteEvent,
} from "../controllers/eventsController.js";

const eventsRouter = express.Router();

eventsRouter.get("/:username/events", auth, getEvents);
eventsRouter.get("/attachments/:eventId", getAttachments);
eventsRouter.post("/new/event", auth, addEvent);
eventsRouter.delete("/:username/delete/event/:eventId", auth, deleteEvent);

export default eventsRouter;
