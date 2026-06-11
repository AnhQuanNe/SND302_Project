import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import dotenv from "dotenv";
dotenv.config();
await mongoose.connect(
  "mongodb://localhost:27017/queue_management"
);

const hashedPassword = await bcrypt.hash(
  "123456",
  10
);

await User.create({
  fullName: "Admin",
  email: "admin@gmail.com",
  password: hashedPassword,
  role: "admin",
});

console.log("Admin Created");
console.log(process.env.MONGO_URI);
process.exit();