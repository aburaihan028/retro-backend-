import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
import { CustomError } from "../helpers/customError.js";
import { cartModle } from "../models/cart.model.js";
import { validateCart } from "../validation/cartValidation.js";
import productModle from "../models/product.model.js";

// add to cart method
export const addToCart = asyncHandler(async (req, res) => {
  const data = await validateCart(req);
  console.log(data);
  let product = {};
  data?.items?.map(async (item) => {
    if (item.product) {
      const response = await productModle.findById(item.product);
      // console.log(response);
      product = response._id;
    }
  });
});
