import express from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import serviceRoutes from "./service.routes.js";
import queueRoutes from "./queue.routes.js";
import userRoutes from "./user.routes.js";
import staffRoutes from "./staff.routes.js";
import counterRoutes from "./counter.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/staff", staffRoutes);
router.use("/services", serviceRoutes);
router.use("/queue", queueRoutes);
router.use("/users", userRoutes);
router.use("/counters", counterRoutes);

export default router;