import express from "express";
import {
  createUser,
  getUsers,
  disableUser,
  enableUser,
  deleteUser
} from "../controllers/userController.js";

import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, allowRoles("SUPER_ADMIN"));

router.post("/", createUser);
router.get("/", getUsers);
router.patch("/:id/disable", disableUser);
router.patch("/:id/enable", enableUser);
router.delete("/:id", deleteUser);

export default router;
