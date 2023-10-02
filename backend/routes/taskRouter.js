import express from "express";
import auth from "../auth/authenticateToken.js";
import { createTask,getTasks } from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/all/tasks", auth, getTasks);
taskRouter.post("/new/tasks", auth, createTask);

export default taskRouter;
