import express from "express";
import userRoute from "./api/user.api.js";
import productRoute from "./api/product.api.js";
import cartRoute from "./api/cart.api.js";

const rootRouter = express.Router();

rootRouter.use("/auth", userRoute);
rootRouter.use("/product", productRoute);
rootRouter.use("/cart", cartRoute);

export default rootRouter;
