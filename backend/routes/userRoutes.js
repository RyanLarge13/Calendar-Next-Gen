import express from "express";
import { loginWithGoogle } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/login/google", loginWithGoogle);

export default userRouter;
