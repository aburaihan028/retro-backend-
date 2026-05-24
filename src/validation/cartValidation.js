import Joi from "joi";
import { CustomError } from "../helpers/customError.js";

const cartSchema = Joi.object({
  user: Joi.string().trim().hex().length(24).allow(null).optional().messages({
    "string.hex": "Invalid user id",
    "string.length": "User id must be 24 characters",
  }),

  guestId: Joi.string().trim().optional().messages({
    "string.base": "Guest id must be a string",
  }),

  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().trim().hex().length(24).required().messages({
          "string.empty": "Product id is required",
          "string.hex": "Invalid product id",
          "string.length": "Product id must be 24 characters",
          "any.required": "Product id is required",
        }),

        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),

        price: Joi.number().min(0).required().messages({
          "number.base": "Price must be a number",
          "number.min": "Price must be greater than or equal to 0",
          "any.required": "Price is required",
        }),

        totalPrice: Joi.number().min(0).required().messages({
          "number.base": "Total price must be a number",
          "number.min": "Total price must be greater than or equal to 0",
          "any.required": "Total price is required",
        }),

        size: Joi.string().trim().optional().allow(null, ""),

        color: Joi.string().trim().optional().allow(null, ""),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Items must be an array",
      "array.min": "At least one cart item is required",
      "any.required": "Items are required",
    }),

  grossTotalAmount: Joi.number().min(0).optional().messages({
    "number.base": "Gross total amount must be a number",
    "number.min": "Gross total amount cannot be negative",
  }),

  totalQuantity: Joi.number().integer().min(0).optional().messages({
    "number.base": "Total quantity must be a number",
    "number.min": "Total quantity cannot be negative",
  }),

  finalAmount: Joi.number().min(0).optional().messages({
    "number.base": "Final amount must be a number",
    "number.min": "Final amount cannot be negative",
  }),

  discountAmount: Joi.number().min(0).optional().messages({
    "number.base": "Discount amount must be a number",
    "number.min": "Discount amount cannot be negative",
  }),
}).unknown(true);

export const validateCart = async (req) => {
  try {
    const value = await cartSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    // Either user or guestId required
    if (!value.user && !value.guestId) {
      throw new CustomError(401, "Either user id or guestId is required");
    }

    return value;
  } catch (error) {
    if (!error.details) {
      throw new CustomError(401, error.message);
    }

    throw new CustomError(
      401,
      error.details.map((err) => err.message).join(", "),
    );
  }
};
