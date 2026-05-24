import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateUser } from "../validation/userValidation.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
import { CustomError } from "../helpers/customError.js";
import { sendmail } from "../helpers/nodemailer.js";
import {
  registrationTemplate,
  resendTemplate,
  resetPasswordTemplate,
} from "../templet/registrationTamplete.js";

// user registration
export const registration = asyncHandler(async (req, res) => {
  const value = await validateUser(req);

  // now save the user data
  const userData = await new userModel({
    name: value?.name,
    email: value?.email,
    phone: value?.phone,
    password: value?.password,
  }).save();
  // generate OTP
  const OTP_CODE = crypto.randomInt(100000, 999999).toString();
  // hash OTP
  const hashedOTP = crypto.createHash("sha256").update(OTP_CODE).digest("hex");

  const emailExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  const EXPIRY_TIME = Math.floor((emailExpiry - Date.now()) / 1000 / 60);

  // Verification Code send your email
  const templete = registrationTemplate(userData.name, OTP_CODE, EXPIRY_TIME);

  await sendmail("Verify your account", templete, userData?.email);

  userData.emailVerifyOtp = hashedOTP;
  userData.emailVerifyExpires = emailExpiry;

  await userData.save();

  apiResponse.sendSucess(res, 201, "Registration Sucessfull", userData);
});

// verifyOTP for user email
export const EmailVerifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new CustomError(405, "email or OTP missing");
  }

  // ✅ find user
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  // ✅ check OTP exists (EMAIL OTP, not reset password)
  if (!user.emailVerifyOtp || !user.emailVerifyExpires) {
    throw new CustomError(400, "No OTP found. Please request again.");
  }

  // ✅ check expiry
  if (user.emailVerifyExpires < Date.now()) {
    throw new CustomError(400, "OTP expired");
  }

  // ✅ hash incoming OTP
  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  // ✅ compare OTP
  if (user.emailVerifyOtp !== hashedOTP) {
    throw new CustomError(400, "Invalid OTP");
  }

  // ✅ verify user
  user.isEmailVerified = true;
  // ✅ clear OTP fields
  user.emailVerifyOtp = null;
  user.emailVerifyExpires = null;
  await user.save();

  apiResponse.sendSucess(res, 200, "Email verified successfully", {
    email: user.email,
    verified: true,
  });
});

// resend user email verifyOTP code
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError(400, "Email missing");
  }

  // ✅ find user
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  // ❌ already verified হলে resend লাগবে না
  if (user.isEmailVerified) {
    throw new CustomError(400, "Email already verified");
  }

  // 🚫 spam protection (1 min cooldown)
  if (
    user.emailVerifyExpires &&
    user.emailVerifyExpires > Date.now() - 60 * 1000
  ) {
    throw new CustomError(429, "Please wait before requesting another OTP");
  }

  // ✅ new OTP generate
  const OTP_CODE = crypto.randomInt(100000, 999999).toString();

  // ✅ hash OTP
  const hashedOTP = crypto.createHash("sha256").update(OTP_CODE).digest("hex");

  // ✅ expiry time (10 min same as registration)
  const emailExpiry = Date.now() + 10 * 60 * 1000;
  const EXPIRY_TIME = Math.floor((emailExpiry - Date.now()) / 1000 / 60);

  // ✅ reuse template
  const templete = resendTemplate(user.name, OTP_CODE, EXPIRY_TIME);

  // ✅ send mail (your helper)
  await sendmail("Resend OTP - Verify your account", templete, user.email);

  // ✅ save correct fields
  user.emailVerifyOtp = hashedOTP;
  user.emailVerifyExpires = emailExpiry;

  await user.save();

  apiResponse.sendSucess(res, 200, "OTP resent successfully", {
    email: user.email,
  });
});

// forget password
export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError(400, "Email is required");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  // 🔐 generate OTP
  const OTP_CODE = crypto.randomInt(100000, 999999).toString();

  // 🔐 hash OTP
  const hashedOTP = crypto.createHash("sha256").update(OTP_CODE).digest("hex");

  // ⏳ expiry (10 min)
  const emailExpiry = Date.now() + 10 * 60 * 1000;

  // 📩 email template (create this)
  const template = resetPasswordTemplate(user.name, OTP_CODE, emailExpiry);

  await sendmail("Reset Your Password", template, user.email);

  // 💾 save OTP
  user.resetPasswordOtp = hashedOTP;
  user.resetPasswordExpires = emailExpiry;

  // 🆕 save cooldown timestamp
  user.lastOtpSentAt = Date.now();
  await user.save();

  apiResponse.sendSucess(res, 200, "OTP sent to email", {
    email: user.email,
  });
});

// OTPveryfied forget pass
export const verifyResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new CustomError(404, "Email and OTP are required");
  }

  const user = await userModel.findOne({ email });

  if (!user) throw new CustomError(400, "User not found");

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  if (user.resetPasswordOtp !== hashedOTP) {
    throw new CustomError(400, "Invalid OTP");
  }

  if (user.resetPasswordExpires < Date.now()) {
    throw new CustomError(400, "OTP expired");
  }

  //  mark OTP verified
  user.isResetOtpVerified = true;
  user.resetPasswordOtp = null;
  user.resetPasswordExpires = null;

  await user.save();

  apiResponse.sendSucess(res, 200, "OTP verified");
});

// reset password (Password change)
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    throw new CustomError(400, "email or password missing");
  }

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(newPassword)) {
    throw new CustomError(
      420,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    );
  }

  if (newPassword !== confirmPassword) {
    throw new CustomError(420, "password not match !!");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  // 🔐 set new password
  user.password = newPassword;

  // 🧹 clear OTP
  user.resetPasswordOtp = null;
  user.resetPasswordExpires = null;

  await user.save();

  apiResponse.sendSucess(res, 200, "Password reset successful");
});

// Logged-in user Password Change
export const changePassword = asyncHandler(async (req, res) => {
  // const userId = req.user.id; // from auth middleware
  const { oldPassword, newPassword, userId } = req.body;

  // find By Id user
  const user = await userModel.findById(userId);

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  // User Old Password match
  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new CustomError(400, "Old password incorrect");
  }

  //
  const isSame = await user.comparePassword(newPassword);
  if (isSame) {
    throw new CustomError(400, "New password cannot be same as old password");
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();

  await user.save();

  apiResponse.sendSucess(res, 200, "Password changed");
});

// Check user login credentials
export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate login credentials
  if (!email || !password) {
    throw new CustomError(401, "Email and password are required");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new CustomError(401, "User not found");
  }

  const isMatchPassword = await user.comparePassword(password);

  if (!isMatchPassword) {
    throw new CustomError(401, "User or Password Not Matched !!");
  }

  // generate ACCESS_TOKEN
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  //  send refreshToken into cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // set to true if using HTTPS
    sameSite: "none", // or "Lax" or "None"
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  // set refreshToken into datebase
  user.refreshToken = refreshToken;
  await user.save();

  apiResponse.sendSucess(res, 200, "Logged In Successfully", {
    data: {
      name: user.name,
      accessToken: accessToken,
    },
  });
});

// Logout user
export const userLogout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  // console.log(req.headers.authorization);
  // // ২. চেক করুন টোকেন আছে কি না এবং তা Bearer দিয়ে শুরু কি না
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res
  //     .status(401)
  //     .json({ message: "No token provided or invalid format" });
  // }

  // // ৩. 'Bearer ' অংশটি বাদ দিয়ে শুধু টোকেনটি নিন
  // const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // console.log(decoded);

  const user = await userModel.findById(decoded.id);
  if (!user) throw new CustomError("401", "user not found");

  // clear the refresh token
  user.refreshToken = null;

  await user.save();

  // clear the cookie from browser

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV == "development" ? false : true, // set to true if using HTTPS
    sameSite: "none",
    path: "/",
  });

  apiResponse.sendSucess(res, 200, "logout sucessfull", user);
});
