import mongoose from "mongoose";
import "dotenv/config";

const prot = process.env.MONGODB_URL;

export const connectdb = async () => {
  try {
    const dbinfo = await mongoose.connect(`${prot}/retro`);
    console.log(`Database connection suceesfull ${dbinfo.connection.host}`);
  } catch (error) {
    console.log("error from Failed Database connection", error);
  }
};
