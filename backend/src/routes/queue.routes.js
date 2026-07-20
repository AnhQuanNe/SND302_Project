import express from "express";
import {transferQueue, createQueue, getMyQueue, cancelQueue, getAllQueues, getQueueStatistics, getQueueDetail, updateQueueStatus} from "../controllers/queue.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createQueue);
router.get("/my", protect, getMyQueue);
router.get("/admin/statistics", protect, getQueueStatistics);
router.get("/admin", protect, getAllQueues);
router.get("/admin/:id", protect, getQueueDetail);
router.patch("/admin/:id/status", protect, updateQueueStatus);
router.patch("/admin/:id/transfer", protect, transferQueue );
router.delete("/:queueId", protect, cancelQueue);

export default router;