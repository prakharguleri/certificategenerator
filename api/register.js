import { connectDB } from "@/lib/mongodb";
import User from "@/lib/user";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const password_hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password_hash });

  res.status(201).json({ success: true });
}
