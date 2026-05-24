import mongoose from "mongoose";
import slugify from "slugify";
import { CustomError } from "../helpers/customError.js";
const { Schema, Types } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: [{}],
    category: {
      type: Types.ObjectId,
      ref: "Category",
      trim: true,
      required: true,
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "SubCategory",
      trim: true,
    },
    sizes: [
      {
        trim: true,
        type: String,
        required: true,
      },
    ],
    color: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    bestseller: {
      type: Boolean,
    },
    date: { type: Number, required: true },
  },
  { timestamps: true }, // Auto-generate createdAt and updatedAt
);

// make a slug with slugify
productSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
    });
  }
});

// check product slug already exists
productSchema.pre("save", async function () {
  const isExist = await this.constructor.findOne({ slug: this.slug });
  if (isExist && !isExist._id.equals(this._id.toString())) {
    throw new CustomError(402, `${this.name} already exists, try another one`);
  }
});

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
