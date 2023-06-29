import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import eventsRouter from "./routes/eventsRouter.js";
import reminderRouter from "./routes/remindersRouter.js";
import notifRouter from "./routes/notificationRoutes.js";
import listRouter from "./routes/listRouter.js";
import {
  setSubscription,
  sendNotification,
} from "./utils/notificationService.js";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRouter, eventsRouter, reminderRouter, notifRouter, listRouter);

app.post("/subscribe/notifs", (req, res) => {
  console.log("I am here!!");
  const subscription = req.body;
  res.status(200).json({ message: "Subscription received successfully" });
  const payload = JSON.stringify({
    title: "Welcome!",
    body: "Thank you for subscribing!",
  });
  setSubscription(subscription);
  sendNotification(payload);
});

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
