import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
