import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: { type: Number }   // 🔥 CHANGE TO NUMBER
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);