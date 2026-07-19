import User from "../models/User.js";
import {
    getStaffList
} from "../services/user.service.js";


// Lấy thông tin cá nhân
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin cá nhân
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật các trường thông tin (trừ email, role, status)
    if (req.body.fullName) user.fullName = req.body.fullName;
    
    // validate giới tính
    if (req.body.gender !== undefined) {
      if (["Nam", "Nữ", "Khác", ""].includes(req.body.gender)) {
        user.gender = req.body.gender;
      } else {
        return res.status(400).json({ message: "Giới tính không hợp lệ" });
      }
    }

    if (req.body.dob !== undefined) user.dob = req.body.dob;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.address !== undefined) user.address = req.body.address;

    // Lưu dữ liệu vào MongoDB
    const updatedUser = await user.save();
    
    res.json({
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStaff = async(req,res)=>{

    try {

        const staffs = await getStaffList();


        return res.status(200).json({
            success:true,
            data:staffs
        });


    } catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

};