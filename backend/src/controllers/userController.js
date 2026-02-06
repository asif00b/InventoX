import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const {
    username,
    password,
    role,
    name,
    employeeId,
    designation,
    department,
    photo,
    phone
  } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ msg: "All fields required" });
  }

  const exists = await User.findOne({ username });
  if (exists)
    return res.status(400).json({ msg: "User exists" });

  const user = await User.create({
    username,
    password: await bcrypt.hash(password, 10),
    role,
    name,
    employeeId,
    designation,
    department,
    photo,
    phone
  });

  res.json({
    id: user._id,
    username: user.username,
    role: user.role,
    name: user.name,
    employeeId: user.employeeId,
    designation: user.designation,
    phone: user.phone,
    department: user.department,
    photo: user.photo,
    createdAt: user.createdAt
  });
};

export const getUsers = async (req, res) => {
  const users = await User.find({
    role: { $ne: "SUPER_ADMIN" }
  }).select("-password");

  res.json(users);
};

export const disableUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ msg: "User disabled" });
};

export const enableUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: true });
  res.json({ msg: "User enabled" });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
};
