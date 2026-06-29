import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// GET ALL
export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const filterQuery = {};
    if (req.query.roles) {
      // Chuyển chuỗi "staff,admin" thành mảng ['staff', 'admin']
      const rolesArray = req.query.roles.split(",");
      // Dùng toán tử $in của MongoDB để tìm user có role nằm trong mảng
      filterQuery.role = { $in: rolesArray,};
    }

    const [users, totalUsers] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(filterQuery),
    ]);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({message: "Nghiệp vụ từ chối. Không thể khóa quản trị viên."});
    }

    user.status = "inactive";
    await  user.save();

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
      { returnDocument: "after" }
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
