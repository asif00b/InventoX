import User from "../models/User.js";
import Setting from "../models/Setting.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, isActive: true });
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

  // 🔹 Read timeout from DB
  const setting = await Setting.findOne({ key: "sessionTimeout" });
  const timeoutMinutes = setting ? Number(setting.value) : 15;

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: `${timeoutMinutes}m` }
  );

  res.json({ token, role: user.role });
};

/* ================= CHANGE PASSWORD ================= */

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: "All fields required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    return res.status(400).json({ msg: "Current password incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ msg: "Password changed successfully" });
};