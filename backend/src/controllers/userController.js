import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* CREATE */
export const createUser = async (req, res) => {
  try {
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
      return res.status(400).json({ msg: "Username, password and role required" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ msg: "Username already exists" });
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

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);

  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


/* READ */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "SUPER_ADMIN" },
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


/* UPDATE */
export const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (password && password.trim() !== "") {
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

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


/* DISABLE */
export const disableUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ msg: "User disabled" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};


/* ENABLE */
export const enableUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: true });
    res.json({ msg: "User enabled" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};


/* DELETE */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted" });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};
