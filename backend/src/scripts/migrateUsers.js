import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";

// OLD local DB
const LOCAL_URI = "mongodb://localhost:27017/inventox";

// NEW Atlas DB
const ATLAS_URI = process.env.MONGO_URI;

async function run() {
  // connect both DBs
  const localConn = await mongoose.createConnection(LOCAL_URI);
  const atlasConn = await mongoose.createConnection(ATLAS_URI);

  const LocalUser = localConn.model("User", User.schema);
  const AtlasUser = atlasConn.model("User", User.schema);

  const users = await LocalUser.find();

  for (const u of users) {
    const obj = u.toObject();

    // 🔴 remove conflict fields
    delete obj._id;
    delete obj.createdAt;
    delete obj.updatedAt;

    await AtlasUser.updateOne(
      { username: u.username },   // ✅ unique field
      { $setOnInsert: obj },
      { upsert: true }
    );
  }

  console.log("Users merged safely");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
