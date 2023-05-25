import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import auth from "./auth/authenticateToken.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import webpush from "web-push";
import userRouter from "./routes/userRoutes.js";
import eventsRouter from "./routes/eventsRouter.js";
import reminderRouter from "./routes/remindersRouter.js";
import notifRouter from "./routes/notificationRoutes.js";
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
app.use("/", userRouter, eventsRouter, reminderRouter, notifRouter);

//Notification Subscription Endpoint
app.post("/subscribe/reminders", auth, (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const { sub, reminder } = req.body;
  const { id } = req.user;
  const reminderTime = new Date(reminder.time).getTime();
  const now = new Date().getTime();
  const delay = reminderTime - now;
  res.status(201).json({ message: "Reminder set" });
  setTimeout(() => {
    sendNotification(JSON.parse(sub), reminder);
    createNotifcation(reminder, id);
  }, delay);
});

//Sending notification
const sendNotification = (sub, reminder) => {
  const payload = { title: reminder.title, notes: reminder.notes };
  webpush
    .sendNotification(sub, JSON.stringify(payload))
    .catch((err) => console.log(err));
};

//Creating a new Prisma Notification @ specified Date
const createNotifcation = async (reminder, userId) => {
  const newNotif = {
    read: false,
    type: "reminder",
    readTime: null,
    notifData: { ...reminder },
    userId: userId,
  };
  await prisma.notification.create({
    data: newNotif,
  });
};

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
