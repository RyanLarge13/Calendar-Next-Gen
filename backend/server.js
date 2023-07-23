import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import eventsRouter from "./routes/eventsRouter.js";
import reminderRouter from "./routes/remindersRouter.js";
import notifRouter from "./routes/notificationRoutes.js";
import listRouter from "./routes/listRouter.js";
import processPushNotifications from "./utils/globalCron.js";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRouter, eventsRouter, reminderRouter, notifRouter, listRouter);
processPushNotifications()

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
