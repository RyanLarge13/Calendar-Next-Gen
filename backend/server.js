import { PrismaClient } from "@prisma/client";
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
const prisma = new PrismaClient();
let subscription;

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
  const { sub } = req.body;
  subscription = sub;
  res
    .status(201)
    .json({ message: "You have successfully subscribed to notifications" });
});

//Sending notification
const sendNotification = (sub, reminder) => {
  const payload = { title: reminder.title, notes: reminder.notes };
  webpush
    .sendNotification(sub, JSON.stringify(payload))
    .catch((err) => console.log(err));
};

//Creating a new Prisma Notification @ specified Date
const createNotifcation = async (reminder, userId, res) => {
  const newNotif = {
    read: false,
    type: "reminder",
    readTime: null,
    notifData: { ...reminder },
    userId: userId,
  };
  const createdNotif = await prisma.notification.create({
    data: newNotif,
  });
  if (createdNotif) {
    res.status(201).json({ message: "Reminder set" });
  }
  if (!createdNotif) {
  }
};

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
