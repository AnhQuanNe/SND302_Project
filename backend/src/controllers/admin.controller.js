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
    
    // Lọc theo Role
    if (req.query.role) {
      const rolesArray = req.query.role.split(",");
      filterQuery.role = { $in: rolesArray };
    }

    // TÍCH HỢP TÌM KIẾM THEO TÊN HOẶC EMAIL
    if (req.query.search) {
      filterQuery.$or = [
        { email: { $regex: req.query.search, $options: "i" } }, // $options: 'i' giúp tìm kiếm không phân biệt hoa thường
        { fullName: { $regex: req.query.search, $options: "i" } }
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filterQuery).skip(skip).limit(limit),
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
    res.status(500).json({ message: error.message });
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


//create staff
export const createStaff = async (req, res) => {
  try {
    // 1. Chỉ nhận email và password từ Frontend gửi lên
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin email hoặc mật khẩu!" });
    }

    // 2. Kiểm tra chính xác theo trường email
    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
      return res.status(400).json({ message: "Tài khoản này đã tồn tại!" });
    }

    // 3. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo user mới khớp hoàn toàn với userSchema của bạn
    const user = await User.create({
      email: email, 
      password: hashedPassword,
      fullName: "Tài khoản trắng", // Schema yêu cầu required: true
      role: "staff",
      status: "active",
      verified: true,
      gender: "",
      phone: ""
    });

    res.status(201).json(user);
  } catch (error) {
    // Bắt lỗi MongoDB trùng lặp (Mã lỗi 11000 là duplicate key)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tài khoản (Email) này đã tồn tại trong CSDL!" });
    }
    res.status(500).json({ message: error.message });
  }
};

// RESET STAFF PASSWORD (Thu hồi & Reset)
export const resetStaffPassword = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        password: hashedPassword,
        // Có thể reset thêm trạng thái hoặc thu hồi vị trí ở đây nếu cần
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Reset mật khẩu thành công", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


