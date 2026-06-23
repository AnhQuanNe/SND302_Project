import express from "express";
import { createQueue, getMyQueue, cancelQueue} from "../controllers/queue.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createQueue);
router.get("/my", protect, getMyQueue);
router.delete("/:queueId", protect, cancelQueue);

export default router;