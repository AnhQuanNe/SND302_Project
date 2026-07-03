import express from "express";
import { nextQueue } from "../controllers/staff.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route gọi khách tiếp theo
router.route("/next")
  .post(protect, nextQueue);

export default router;