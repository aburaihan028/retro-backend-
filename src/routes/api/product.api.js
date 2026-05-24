import express from "express";
import { upload } from "../../middleware/multer.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} from "../../controllers/product.controller.js";
const router = express.Router();

router
  .route("/create-product")
  .post(upload.fields([{ name: "image", maxCount: 4 }]), createProduct);
router.route("/all-product").get(getAllProducts);
router.route("/single-product/:slug").get(getSingleProduct);
router.route("/delete-product/:slug").delete(deleteProduct);

export default router;
