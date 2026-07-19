import express from "express";
import { 
    getCounters,
    getCounterDetail,
    createCounterController,
    updateCounterInfo,
    assignStaff,
    deleteCounterInfo
} from "../controllers/counter.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/")
    .get(protect, getCounters);

// Route tạo quầy mới
router.route("/newCounter")
    .post(protect, createCounterController);

// Route cập nhật thông tin quầy
router.route("/:id")
    .put(protect, updateCounterInfo);

// Route phân công nhân viên vào quầy
router.route("/:id/assign-staff")
    .put(protect, assignStaff);

// Route xóa quầy mềm
router.route("/:id")
    .delete(protect, deleteCounterInfo);

// Route lấy thông tin chi tiết quầy
router.route("/:id")
    .get(protect, getCounterDetail);

export default router;