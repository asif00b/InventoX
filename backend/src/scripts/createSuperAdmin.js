import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const exists = await User.findOne({ username: "superadmin" });
if (exists) {
  console.log("SUPER_ADMIN already exists");
  process.exit();
}

await User.create({
  username: "superadmin",
  password: await bcrypt.hash("admin123", 10),
  role: "SUPER_ADMIN"
});

console.log("SUPER_ADMIN created");
process.exit();
