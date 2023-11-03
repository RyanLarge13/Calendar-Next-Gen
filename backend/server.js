import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import userRouter from "./routes/userRoutes.js";
import eventsRouter from "./routes/eventsRouter.js";
import reminderRouter from "./routes/remindersRouter.js";
import notifRouter from "./routes/notificationRoutes.js";
import listRouter from "./routes/listRouter.js";
import taskRouter from "./routes/taskRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import kanbanRouter from "./routes/kanbanRouter.js";
import processPushNotifications from "./utils/globalCron.js";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(
  "/",
  userRouter,
  eventsRouter,
  reminderRouter,
  notifRouter,
  listRouter,
  taskRouter,
  kanbanRouter
);
app.use("/friends", friendsRouter);

// cron.schedule("*/15 * * * * *", () => {
//   processPushNotifications();
// });

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
