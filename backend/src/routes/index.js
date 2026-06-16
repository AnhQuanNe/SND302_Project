import express from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import serviceRoutes from "./service.routes.js";
import queueRoutes from "./queue.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/admin", adminRoutes);
// Service
router.use("/services", serviceRoutes);

// Queue
router.use("/queue", queueRoutes);


export default router;