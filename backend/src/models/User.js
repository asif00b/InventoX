import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: { type: String },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
      default: "VIEWER",
    },

    isActive: { type: Boolean, default: true },

    // New fields
    name: { type: String },
    employeeId: { type: String },
    designation: { type: String },
    department: { type: String },
    photo: { type: String },
    phone: { type: String }
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export default mongoose.model("User", userSchema);
