import bcrypt from "bcrypt";
import mongoose, { Types } from "mongoose";
import { CustomError } from "../helpers/customError.js";
const { Schema } = mongoose;

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
    isResetOtpVerified: {
      type: Boolean,
      default: false,
    },
    // ✅ optional (security)
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
    const hashPassword = bcrypt.hash(this.password, 13);
    this.password = hashPassword;
  }
});

// compare password methods
userSchema.methods.comparePassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};

const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;
