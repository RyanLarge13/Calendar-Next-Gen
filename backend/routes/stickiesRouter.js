import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  addNewSticky,
  getAllStickies,
} from "../controllers/stickiesController.js";

const stickiesRouter = express.Router();

stickiesRouter.get("/user/stickies", auth, getAllStickies);
stickiesRouter.post("/add/sticky", auth, addNewSticky);
stickiesRouter.delete("/delete/sticky/:stickyId", auth, deleteSticky);

export default stickiesRouter;
