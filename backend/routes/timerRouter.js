import express from "express";
import prisma from "../utils/prismaClient.js";
import auth from "../auth/authenticateToken.js";
import { getUsersTimers } from "../controllers/timersController.js";

const timerRouter = express.Router();

timerRouter.get("/user/timers", auth, getUsersTimers);

export default timerRouter;
