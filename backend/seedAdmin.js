import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({
      email: "admin@gmail.com"
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "123456",
      10
    );

    await User.create({
      fullName: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      verified: true
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seedAdmin();