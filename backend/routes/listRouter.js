import express from "express";
import prisma from "../utils/prismaClient.js";
import auth from "../auth/authenticateToken.js";
import authorizeDelete from "../middleware/authorizeDelete.js";
import {
  getLists,
  addNewList,
  updateList,
  deleteList,
  updateListTitle,
  updateListItems,
} from "../controllers/listController.js";

const listRouter = express.Router();

listRouter.get("/:username/lists", auth, getLists);
listRouter.post("/new/list/:username", auth, addNewList);
listRouter.patch("/update/lists", auth, updateList);
listRouter.patch("/update/list/item", auth, updateListItems);
listRouter.patch("/update/list/title", auth, updateListTitle);
listRouter.delete(
  "/delete/list/:listId",
  auth,
  authorizeDelete("listId", prisma.list),
  deleteList,
);

export default listRouter;
