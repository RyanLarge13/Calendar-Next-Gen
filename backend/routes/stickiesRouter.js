import express from "express";
import prisma from "../utils/prismaClient.js";
import auth from "../auth/authenticateToken.js";
import authorizeDelete from "../middleware/authorizeDelete.js";
import {
  addNewSticky,
  getAllStickies,
  deleteSticky,
  updateSticky,
  updateStickyView,
} from "../controllers/stickiesController.js";

const stickiesRouter = express.Router();

stickiesRouter.get("/user/stickies", auth, getAllStickies);
stickiesRouter.put("/update/sticky", auth, updateSticky);
stickiesRouter.put("/update/sticky/view", auth, updateStickyView);
stickiesRouter.post("/add/sticky", auth, addNewSticky);
stickiesRouter.delete(
  "/delete/sticky/:stickyId",
  auth,
  authorizeDelete("stickyId", prisma.sticky),
  deleteSticky
);

export default stickiesRouter;
