import express from "express";

import auth from "../auth/authenticateToken.js";
import {
  sendRequestFromQrCode,
  sendRequestFromEmail,
  findUsersRequestsAndFriends,
  cancelFriendRequest,
  acceptFriendRequest,
} from "../controllers/friendsController.js";

const friendsRouter = express.Router();

friendsRouter.get("/friendinfo", auth, findUsersRequestsAndFriends);
friendsRouter.post(
  "/add/request/qrcode/:usersEmail/:myId",
  auth,
  sendRequestFromQrCode
);
friendsRouter.post("/add/request/email/:userEmail", auth, sendRequestFromEmail);
friendsRouter.post("/accept/request", auth, acceptFriendRequest);
friendsRouter.delete(
  "/cancel/request/email/:recipientsEmail",
  auth,
  cancelFriendRequest
);

export default friendsRouter;
