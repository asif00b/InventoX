import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* CREATE */
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
    phone,
  } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ msg: "All fields required" });
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).json({ msg: "User exists" });
  }

  const user = await User.create({
    username,
    password: await bcrypt.hash(password, 10),
    role,
    name,
    employeeId,
    designation,
    department,
    photo,
    phone,
  });

  res.json(user);
};

/* READ */
export const getUsers = async (req, res) => {
  const users = await User.find({
    role: { $ne: "SUPER_ADMIN" },
  }).select("-password");

  res.json(users);
};

/* UPDATE (FIX) */
export const updateUser = async (req, res) => {
  const { password, ...rest } = req.body;

  // do not overwrite password if empty
  if (password) {
    rest.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    rest,
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.json(user);
};

/* DISABLE */
export const disableUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ msg: "User disabled" });
};

/* ENABLE */
export const enableUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: true });
  res.json({ msg: "User enabled" });
};

/* DELETE */
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
};
