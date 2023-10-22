import express from "express";
import auth from "../auth/authenticateToken.js";
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
taskRouter.delete("/delete/task/:taskId", auth, deleteTask);

export default taskRouter;
