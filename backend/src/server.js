import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);