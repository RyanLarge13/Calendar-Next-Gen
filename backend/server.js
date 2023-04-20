import express from "express";
import dotenv from "dotenv";
import pool from "./config.js";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", async (req, res) => {
  const users = await pool.query("SELECT * FROM users;");
  console.log(users)
  res.send({ users });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
