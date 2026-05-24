import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../helpers/customError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadCloudinaryFile = async (filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath))
      throw new CustomError(401, "image path missing");

    // image upload cloudinary
    const respose = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      quality: "auto",
    });
    // console.log(respose);

    if (respose) {
      fs.unlinkSync(filePath);
    }
    return { publicId: respose.public_id, secureUrl: respose.secure_url };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new CustomError(500, "Failed to upload image");
  }
};

// delete
export const deleteCloudinaryFile = async (publicId, filePath) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new CoustomError(
      500,
      "Cloudinary Filed to delete image" + error.message,
    );
  }
};
