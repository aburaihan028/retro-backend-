import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // যেমন: "admin", "user", "editor"
  },
});
export const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
