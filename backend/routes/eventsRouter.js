import express from "express";
import prisma from "../utils/prismaClient.js"
import auth from "../auth/authenticateToken.js";
import authorizeDelete from "../middleware/authorizeDelete.js";
import {
  getEvents,
  getAttachments,
  addEvent,
  deleteEvent,
  createAttachments,
} from "../controllers/eventsController.js";

const eventsRouter = express.Router();

eventsRouter.get("/:username/events", auth, getEvents);
eventsRouter.get("/attachments/:eventId", getAttachments);
eventsRouter.post("/new/event", auth, addEvent);
eventsRouter.post("/new/attachments/:newEventId", auth, createAttachments);
eventsRouter.delete(
  "/:username/delete/event/:eventId",
  auth,
  authorizeDelete("eventId", prisma.event),
  deleteEvent
);

export default eventsRouter;
