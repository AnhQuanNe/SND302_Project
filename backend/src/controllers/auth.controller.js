import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.utils.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } =
      req.body;

    const existedUser = await User.findOne({
      email,
    });

    if (existedUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    };

    const allowedRoles = ["customer", "staff"];
    if (role && !allowedRoles.includes(role)){
      return res.status(400).json({
        message: "Invalid Role"
      })
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken({id: user._id, role: user.role});

    res.status(201).json({
      message: "Register success",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};