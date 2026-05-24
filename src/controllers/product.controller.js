import productModle from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
import { CustomError } from "../helpers/customError.js";
import { validateProduct } from "../validation/productValidation.js";
import {
  deleteCloudinaryFile,
  uploadCloudinaryFile,
} from "../config/cloudinary.js";

// create products
export const createProduct = asyncHandler(async (req, res) => {
  const data = await validateProduct(req);

  let allImageInfo = [];

  try {
    // upload images
    allImageInfo = await Promise.all(
      data?.image?.map((img) => uploadCloudinaryFile(img.path)),
    );

    // create product
    const product = await productModle.create({
      ...data,
      image: allImageInfo,
    });

    apiResponse.sendSucess(res, 201, "Product created successfully", product);
  } catch (error) {
    // rollback uploaded images
    if (allImageInfo.length > 0) {
      await Promise.all(
        allImageInfo.map((img) => deleteCloudinaryFile(img.publicId)),
      );
    }

    throw error;
  }
});

// get all products list
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productModle.find().sort({ createdAt: -1 });

  if (!products || products.length === 0) {
    throw new CustomError(404, "No products found");
  }

  apiResponse.sendSucess(res, 200, "Products retrieved successfully", products);
});

// get single product
export const getSingleProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await productModle.findOne({ slug });
  if (!product) throw new CustomError(404, "No products found");

  apiResponse.sendSucess(res, 200, "Product retrieved successfully", product);
});

// delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await productModle.findOneAndDelete({ slug });
  if (!product) {
    throw new CustomError(404, "Product not found");
  }
  // delete images from cloudinary
  if (product.image?.length) {
    await Promise.all(
      product.image.map((img) => deleteCloudinaryFile(img.publicId)),
    );
  }

  apiResponse.sendSucess(res, 200, "Product deleted successfully", product);
});
