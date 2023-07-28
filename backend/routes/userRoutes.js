import express from "express";
import {
  fetchUserData,
  loginWithGoogle,
  loginWithPasswordUsername,
  fetchGoogleCalendarEvents,
} from "../controllers/userControllers.js";
import auth from "../auth/authenticateToken.js";

const userRouter = express.Router();

userRouter.get(
  "/google/calendar/events/:accessToken",
  auth,
  fetchGoogleCalendarEvents
);
userRouter.get("/user/data", auth, fetchUserData);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/login/classic", loginWithPasswordUsername);

export default userRouter;
