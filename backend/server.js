import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
