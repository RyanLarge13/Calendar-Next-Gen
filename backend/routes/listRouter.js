import express from "express";
import auth from "../auth/authenticateToken.js";
import { getLists, addNewList } from "../controllers/listController.js";

const listRouter = express.Router();

listRouter.get("/:username/lists", auth, getLists);
listRouter.post("/new/list/:username", auth, addNewList);

export default listRouter;
