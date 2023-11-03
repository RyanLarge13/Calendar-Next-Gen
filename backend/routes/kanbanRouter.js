import express from "express";

import auth from "../auth/authenticateToken.js";
import { createNewKanban } from "../controllers/kanbanController.js";

const kanbanRouter = express.Router();

kanbanRouter.post("/kanban/new", auth, createNewKanban);

export default kanbanRouter;
