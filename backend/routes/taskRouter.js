import express from "express";
import prisma from "../utils/prismaClient.js";
import auth from "../auth/authenticateToken.js";
import authorizeDelete from "../middleware/authorizeDelete.js"
import {
  createTask,
  getTasks,
  updateTasks,
  deleteTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/all/tasks", auth, getTasks);
taskRouter.post("/new/tasks", auth, createTask);
taskRouter.post("/update/tasks", auth, updateTasks);
taskRouter.delete("/delete/task/:taskId", auth, authorizeDelete("taskId", prisma.task), deleteTask);

export default taskRouter;
