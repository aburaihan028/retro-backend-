import express from "express";
import { addToCart } from "../../controllers/cart.controller.js";
const router = express.Router();

router.route("/addtocart").post(addToCart);
// router.route("/all-product").get(getAllProducts);
// router.route("/single-product/:slug").get(getSingleProduct);
// router.route("/delete-product/:slug").delete(deleteProduct);

export default router;
