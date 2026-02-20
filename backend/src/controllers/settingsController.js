import Setting from "../models/Setting.js";

/* ================= GET SESSION TIMEOUT ================= */

export const getSessionTimeout = async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: "sessionTimeout" });

    // If not found, create default record
    if (!setting) {
      setting = await Setting.create({
        key: "sessionTimeout",
        value: 15,
      });
    }

    res.json({ timeout: Number(setting.value) });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch session timeout" });
  }
};

/* ================= UPDATE SESSION TIMEOUT ================= */

export const updateSessionTimeout = async (req, res) => {
  try {
    const timeout = Number(req.body.timeout);

    if (!timeout || timeout < 1) {
      return res.status(400).json({ msg: "Invalid timeout value" });
    }

    const setting = await Setting.findOneAndUpdate(
      { key: "sessionTimeout" },
      { key: "sessionTimeout", value: timeout },
      { new: true, upsert: true }
    );

    res.json({ timeout: Number(setting.value) });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update session timeout" });
  }
};