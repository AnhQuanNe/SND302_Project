import express from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route lấy và cập nhật thông tin cá nhân
router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router;
