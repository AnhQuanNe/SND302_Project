import express from "express";

import {
  getUsers,
  getUserById,
  // createUser,
  // updateUser,
  lockUser,
  unlockUser,
  createStaff,
  resetStaffPassword
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", getUsers);

router.get("/users/:id", getUserById);

// router.post("/users", createUser);

// router.put("/users/:id", updateUser);

router.patch("/users/:id/lock", lockUser);

router.patch("/users/:id/unlock", unlockUser);

router.delete("/users/:id", lockUser);

router.post("/users/staff", createStaff);

router.put("/users/staff/:id/reset-password", resetStaffPassword);

export default router;
