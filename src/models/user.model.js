import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const { Schema, Types } = mongoose;
import { CustomError } from "../helpers/customError.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    image: {
      type: String,
      trim: true,
    },
    roles: [
      {
        type: Types.ObjectId,
        ref: "Role",
      },
    ],
    // ✅ Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyOtp: String,
    emailVerifyExpires: Date,
    // ✅ Forget password
    isResetOtpVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordOtp: String,
    resetPasswordExpires: Date,
    // ✅ (security)
    passwordChangedAt: Date,
    lastOtpSentAt: Date,
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
  },
  { minimize: false, timestamps: true },
);

// check user email or phone alredy exites or not
userSchema.pre("save", async function () {
  const isExist = await this.constructor.findOne({
    email: this.email,
  });

  if (isExist && isExist._id.toString() !== this._id.toString()) {
    throw new CustomError(409, "Email already exists");
  }
});

// // make a hash password with mongoose middleware
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashPassword = await bcrypt.hash(this.password, 12);
    this.password = hashPassword;
  }
});

// compare password methods
userSchema.methods.comparePassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};

//  generate ACCESS_TOKEN_SECRET
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      roles: this.roles,
      phone: this.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  );
};

// generate REFRESH_TOKEN_SECRET
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  );
};

// verify ACCESS_TOKEN
userSchema.methods.verifyAccessToken = async function (token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

// verify REFRESH_TOKEN
userSchema.methods.verifyRefreshToken = async function (token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
