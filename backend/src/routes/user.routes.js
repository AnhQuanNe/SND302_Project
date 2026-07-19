import express from "express";
import { getProfile, updateProfile, getAllStaff } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route lấy và cập nhật thông tin cá nhân
router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Route lấy danh sách tất cả nhân viên
router.route("/staff")
  .get(protect, getAllStaff);

export default router;
