import express from "express";

import auth from "../auth/authenticateToken.js";
import { sendRequestFromQrCode } from "../controllers/friendsController.js";

const friendsRouter = express.Router();

friendsRouter.post(
  "/add/request/qrcode/:usersEmail/:myId",
  auth,
  sendRequestFromQrCode
);

export default friendsRouter;
