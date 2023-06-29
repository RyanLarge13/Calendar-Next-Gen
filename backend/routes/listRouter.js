import express from "express";
import auth from "../auth/authenticateToken.js";
import {
  getLists,
  addNewList,
  updateList,
  deleteList,
} from "../controllers/listController.js";

const listRouter = express.Router();

listRouter.get("/:username/lists", auth, getLists);
listRouter.post("/new/list/:username", auth, addNewList);
listRouter.patch("/update/lists", auth, updateList);
listRouter.delete("/delete/list/:listId", auth, deleteList);

export default listRouter;
