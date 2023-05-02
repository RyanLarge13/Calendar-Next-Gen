import express from "express";
import { login } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/login", login);

export default userRouter;
