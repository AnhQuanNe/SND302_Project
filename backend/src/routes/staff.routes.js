import express from "express";
import {
  nextQueue,
  completeCurrentQueue,
  currentQueue,
  skipCurrentQueue,
  recallSkippedQueue,
  updateCounter,
  getCounter,
  getSkippedQueuesList,
} from "../controllers/staff.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route gọi khách tiếp theo
router.route("/next")
  .post(protect, nextQueue);

// Route hoàn thành hàng chờ
router.route("/complete/:queueId")
  .put(protect, completeCurrentQueue);

// Route lấy hàng chờ đang phục vụ
router.route("/current")
  .get(protect, currentQueue);
// Route bỏ qua hàng chờ hiện tại
router.route("/skip/:queueId")
  .put(protect, skipCurrentQueue);

// Route gọi lại hàng chờ đã skip
router.route("/recall/:queueId")
  .put(protect, recallSkippedQueue);

// Route cập nhật trạng thái quầy
router.route("/counter/status")
  .put(protect, updateCounter);

// Route lấy thông tin quầy
router.route("/counter")
  .get(protect, getCounter);

// Route lấy danh sách hàng chờ đã skip
router.route("/skipped")
  .get(protect, getSkippedQueuesList);
export default router;