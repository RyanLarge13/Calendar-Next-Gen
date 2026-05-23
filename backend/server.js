// Express imports
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Router imports
import userRouter from "./routes/userRoutes.js";
import eventsRouter from "./routes/eventsRouter.js";
import reminderRouter from "./routes/remindersRouter.js";
import notifRouter from "./routes/notificationRoutes.js";
import listRouter from "./routes/listRouter.js";
import taskRouter from "./routes/taskRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import kanbanRouter from "./routes/kanbanRouter.js";
import stickiesRouter from "./routes/stickiesRouter.js";
import timerRouter from "./routes/timerRouter.js";

// Cron imports
import processPushNotifications from "./utils/globalCron.js";
import cron from "node-cron";

// Socket.io imports
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import { SocketDBInterface } from "./sockets/socketDB/inMemDb.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "production";
const IS_PRODUCTION = ENV === "production";
const corsOptions = {
  origin: [
    "https://calng.app",
    "https://www.calng.app",
    "http://localhost:5173",
    "https://calendar-next-gen.vercel.app",
  ],
  optionsSuccessStatus: 200,
};

const app = express();
const httpsServer = IS_PRODUCTION
  ? https.createServer(app)
  : https.createServer(
      {
        key: fs.readFileSync("./sockets/certs/key.pem"),
        cert: fs.readFileSync("./sockets/certs/cert.pem"),
      },
      app,
    );
const socketDB = new SocketDBInterface();
const io = new Server(httpsServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Express https handling
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json({ limit: "500mb" }));
app.use(
  "/",
  userRouter,
  eventsRouter,
  reminderRouter,
  notifRouter,
  listRouter,
  taskRouter,
  kanbanRouter,
  stickiesRouter,
  timerRouter,
);
app.use("/friends", friendsRouter);

cron.schedule("*/15 * * * * *", () => {
  processPushNotifications();
});

httpsServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Your app is listening on port ${PORT}`);
});

export { io, socketDB };
