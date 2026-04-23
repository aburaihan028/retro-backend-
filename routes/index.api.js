import express from "express";
import userRoute from "./api/user.api.js";

const rootRouter = express.Router();

// সব মডিউলার রাউট এখানে থাকবে
rootRouter.use("/auth", userRoute);

export default rootRouter;
