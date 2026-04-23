import express from "express";
import {
  EmailVerifyOTP,
  forgetPassword,
  registration,
  resendOTP,
  verifyResetOTP,
} from "../../controllers/user.controller.js";

const router = express.Router();

// চেইনিং ব্যবহার করা ভালো
router.route("/registration").post(registration);
router.route("/verify-email").post(EmailVerifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/forget-password").post(forgetPassword);
router.route("/verify-otp").post(verifyResetOTP);

export default router;
