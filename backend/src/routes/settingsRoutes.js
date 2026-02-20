import express from "express";
import {
  getSessionTimeout,
  updateSessionTimeout,
} from "../controllers/settingsController.js";

import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, allowRoles("SUPER_ADMIN"));

router.get("/session-timeout", getSessionTimeout);
router.post("/session-timeout", updateSessionTimeout);

export default router;