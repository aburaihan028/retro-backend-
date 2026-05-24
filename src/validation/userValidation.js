import Joi from "joi";
import { CustomError } from "../helpers/customError.js";

const registerSchema = Joi.object({
  name: Joi.string().trim().min(5).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 5 characters",
    "string.max": "Name cannot exceed 20 characters",
  }),

  email: Joi.string()
    .trim()
    .email()
    .pattern(
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    )
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
      "string.pattern.base": "Email format is not valid",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^(?:\+88|88)?01[3-9]\d{8}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Invalid Bangladeshi phone number",
    }),

  password: Joi.string()
    .trim()
    .required()
    .min(6)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
    }),
}).unknown(true);

export const validateUser = async (req) => {
  try {
    const value = await registerSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log(error);
    throw new CustomError(
      400,
      error.details.map((err) => err.message).join(", "),
    );
  }
};
