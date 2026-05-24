import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./src/routes/index.api.js";
import { globalErrorHandler } from "./src/helpers/globalErrorHandler.js";

// App Config
const app = express();

// all global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // HTML form data handle করে
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000/",
  }),
);

// rotues
app.use("/api/v1", routes);

// global error handleling middleware
app.use(globalErrorHandler);

export { app };
