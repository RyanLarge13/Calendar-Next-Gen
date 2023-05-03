import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import bodyParser from "body-parser";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
