const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb://localhost:27017/loginuser";

const run = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
  });

  const User = mongoose.models.LoginUser || mongoose.model("LoginUser", userSchema, "loginuser");

  await User.deleteMany({});
  console.log("🧹 Cleared existing users");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const newUser = await User.create({
    name: "Prakhar Guleria",
    email: "prakhar@example.com",
    password: hashedPassword,
  });

  console.log("✅ Inserted user:", newUser.email);
  process.exit();
};

run();
