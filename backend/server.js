import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import eventsRouter from "./routes/eventsRouter.js";
import reminderRouter from "./routes/remindersRouter.js";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRouter, eventsRouter, reminderRouter);

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
