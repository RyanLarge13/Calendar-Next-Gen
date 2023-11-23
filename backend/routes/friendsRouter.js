import express from "express";

import auth from "../auth/authenticateToken.js";
import {
  sendRequestFromQrCode,
  sendRequestFromEmail,
  findUsersRequestsAndFriends,
  cancelFriendRequest
} from "../controllers/friendsController.js";

const friendsRouter = express.Router();

friendsRouter.get("/friendinfo", auth, findUsersRequestsAndFriends);
friendsRouter.post(
  "/add/request/qrcode/:usersEmail/:myId",
  auth,
  sendRequestFromQrCode
);
friendsRouter.post("/add/request/email/:userEmail", auth, sendRequestFromEmail);
friendsRouter.delete("/cancel/request/email/:recipientsEmail", auth, cancelFriendRequest)

export default friendsRouter;
