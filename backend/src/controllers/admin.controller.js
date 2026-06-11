import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET ALL
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// GET BY ID
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

// CREATE
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE
export const updateUser = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(
        data.password,
        10
      );
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    message: "Deleted Successfully",
  });
};