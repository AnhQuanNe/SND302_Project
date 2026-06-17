import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

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
// export const createUser = async (req, res) => {
//   try {
//     const { fullName, email, password, role } = req.body;

//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     const user = await User.create({
//       fullName,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// UPDATE
// export const updateUser = async (req, res) => {
//   try {
//     const data = { ...req.body };

//     if (data.password) {
//       data.password = await bcrypt.hash(
//         data.password,
//         10
//       );
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       data,
//       { new: true }
//     );

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// Delete
// export const deleteUser = async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);

//   res.json({
//     message: "Deleted Successfully",
//   });
// };

// LOCK
export const lockUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User locked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UNLOCK
export const unlockUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User unlocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
