import express from "express";
import { createFeedbacks, getAllFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", createFeedbacks);
router.get("/", getAllFeedback);

export default router;