import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import webpush from "web-push";
import userRouter from "./routes/userRoutes.js";
import eventsRouter from "./routes/eventsRouter.js";
import reminderRouter from "./routes/remindersRouter.js";
dotenv.config();
webpush.setVapidDetails(
  "mailto:test@test.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRouter, eventsRouter, reminderRouter);

//Notification Subscription Endpoint
app.post("/subscribe/reminders", (req, res) => {
  const { sub, reminder } = req.body;

  res.status(201).json({ message: "Reminder set" });
  const reminderTime = new Date(reminder.time).getTime();
  const now = new Date().getTime();
  const delay = reminderTime - now;
  setTimeout(() => {
    sendNotification(JSON.parse(sub), reminder);
  }, delay);
});

const sendNotification = (sub, reminder) => {
  const payload = { title: reminder.title, notes: reminder.notes };
  webpush
    .sendNotification(sub, JSON.stringify(payload))
    .catch((err) => console.log(err));
};

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
