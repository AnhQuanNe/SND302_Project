import express from "express";
import * as controller from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, controller.getNotifications);

router.patch("/:id/read", protect, controller.readNotification);

export default router;