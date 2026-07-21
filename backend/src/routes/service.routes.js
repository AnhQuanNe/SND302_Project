import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", createService);
router.put("/:id", updateService);
router.patch("/:id/toggle", toggleServiceStatus);
router.delete("/:id", deleteService);

export default router;