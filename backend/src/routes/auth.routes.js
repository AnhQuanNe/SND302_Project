import express from "express";

import {
  login,
  register,
  verifyEmail,
  resendOTP
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

export default router;