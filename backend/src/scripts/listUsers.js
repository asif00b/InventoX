import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import User from "../models/User.js";

await connectDB();

const users = await User.find().select("-password");
console.log(users);

process.exit();
