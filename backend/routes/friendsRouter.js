import express from "express";

import auth from "../auth/authenticateToken.js";
import {
  sendRequestFromQrCode,
  sendRequestFromEmail,
  findUsersRequestsAndFriends,
} from "../controllers/friendsController.js";

const friendsRouter = express.Router();

friendsRouter.get("/friendinfo", auth, findUsersRequestsAndFriends);
friendsRouter.post(
  "/add/request/qrcode/:usersEmail/:myId",
  auth,
  sendRequestFromQrCode
);
friendsRouter.post("/add/request/email/:userEmail", auth, sendRequestFromEmail);

export default friendsRouter;
