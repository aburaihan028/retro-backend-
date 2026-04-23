import mongoose from "mongoose";
const { Schema } = mongoose;

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
    image: [
      {
        type: String,
      },
    ],
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
    size: [
      {
        trim: true,
        type: String,
        required: true,
      },
    ],
    bestseller: {
      type: Boolean,
    },
    date: { type: Number, required: true },
  },
  { timestamps: true },
);

const productModel =
  mongoose.models.Product || mongoose.model("product", productSchema);

export default productModel;
