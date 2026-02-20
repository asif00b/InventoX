import express from "express";
import { login, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/change-password", protect, changePassword);

export default router;