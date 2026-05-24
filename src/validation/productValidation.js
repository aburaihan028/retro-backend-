import Joi from "joi";
import { CustomError } from "../helpers/customError.js";

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters",
    "string.max": "Product name cannot exceed 100 characters",
  }),
  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
    "any.required": "Description is required",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required",
  }),

  image: Joi.array().items(Joi.object().unknown(true)).optional().messages({
    "array.base": "Image must be an array",
  }),

  category: Joi.string().trim().hex().length(24).required().messages({
    "string.empty": "Category is required",
    "string.hex": "Invalid category id",
    "string.length": "Category id must be 24 characters",
    "any.required": "Category is required",
  }),

  subCategory: Joi.string().trim().hex().length(24).optional().messages({
    "string.hex": "Invalid subCategory id",
    "string.length": "subCategory id must be 24 characters",
  }),

  sizes: Joi.array()
    .items(Joi.string().trim().required())
    .min(1)
    .required()
    .messages({
      "array.base": "Sizes must be an array",
      "array.min": "At least one size is required",
      "any.required": "Sizes are required",
    }),

  color: Joi.array()
    .items(Joi.string().trim().required())
    .min(1)
    .required()
    .messages({
      "array.base": "Color must be an array",
      "array.min": "At least one color is required",
      "any.required": "Color is required",
    }),

  bestseller: Joi.boolean().optional().messages({
    "boolean.base": "Bestseller must be true or false",
  }),

  date: Joi.number().required().messages({
    "number.base": "Date must be a number",
    "any.required": "Date is required",
  }),
}).unknown(true);

export const validateProduct = async (req) => {
  try {
    const value = await productSchema.validateAsync(req.body);

    let images = [];
    if (req?.files?.image) {
      images = req.files.image;
      const allowFormate = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (images.length > 4) {
        throw new CustomError(401, "Maximum 4 image allowed");

        images.forEach((img) => {
          if (img.size > 5 * 1024 * 1024) {
            throw new CustomError(401, "Image size must be below 5MB");
          }

          if (!allowFormat.includes(img.mimetype)) {
            throw new CustomError(
              401,
              "Only JPG, JPEG, PNG & WEBP image formats are allowed.",
            );
          }
        });
      }
    }

    const res = { ...value, image: images || [] };

    return res;
  } catch (error) {
    // console.log(error);
    if (!error.details) {
      throw new CoustomError(401, error.message);
    } else {
      throw new CoustomError(
        401,
        error.details.map((err) => err.message).join(", "),
      );
    }
  }
};
