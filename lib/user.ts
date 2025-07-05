import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

export default mongoose.models.LoginUser || mongoose.model("LoginUser", UserSchema, "loginuser");
