import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.utils.js";
import { sendVerificationEmail } from "../services/email.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is waiting for approval"
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khóa bởi Admin. Vui lòng liên hệ Admin để được hỗ trợ."
      });
    }

    if (user.status === "banned") {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị cấm. Vui lòng liên hệ Admin để được hỗ trợ."
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        message: "Please verify your email first!!!"
      })
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
        expiresIn: "30m",
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
    const { fullName, email, password, role, phone, gender, dob } = req.body;

    const normalizedEmail = email.toLowerCase().trim(); //Tranh loi "User Not Found";
    const existedUser = await User.findOne({
      email: normalizedEmail,
    });

    //Sinh ma OTP 6 so
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existedUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    };

    const allowedRoles = ["customer", "staff"];
    if (role && !allowedRoles.includes(role)) {
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
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      gender,
      dob,
      verificationCode,
      verificationExpiry: Date.now() + 10 * 60 * 1000,
      verified: false, //Chua verified,
      status: "active"
    });

    //Send email OTP
    await sendVerificationEmail(user.email, verificationCode);

    // const token = generateToken({id: user._id, role: user.role});

    return res.status(201).json({
      message: "Register Success. Please verify your email"
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Sinh OTP mới
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verificationCode = verificationCode;
    user.verificationExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Gửi mail
    await sendVerificationEmail(
      user.email,
      verificationCode
    );

    return res.status(200).json({
      message: "OTP has been sent to your email",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Kiểm tra OTP
    if (
      !user.verificationCode ||
      user.verificationCode !== otp.toString()
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Kiểm tra hết hạn
    if (user.verificationExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật
    user.password = hashedPassword;

    // Xóa OTP
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// === RESEND OTP ===
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Tạo OTP mới
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = verificationCode;
    user.verificationExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Gửi email với try-catch riêng
    try {
      await sendVerificationEmail(normalizedEmail, verificationCode);
      console.log("✅ Gửi email OTP thành công");
    } catch (emailError) {
      console.error("❌ Lỗi gửi email:", emailError.message);
      // Vẫn cho phép resend thành công dù email lỗi (để test)
      // return res.status(500).json({ message: "Không thể gửi email. Vui lòng kiểm tra cấu hình Gmail" });
    }

    res.status(200).json({
      message: "New OTP has been sent to your email"
    });

  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    res.status(500).json({
      message: "Không thể gửi lại OTP. Vui lòng thử lại sau."
    });
  }
};

// === VERIFY EMAIL (Cải thiện lại so với cái cũ) ===
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User Not Found !!!" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!user.verificationCode || user.verificationCode !== code.toString()) {
      return res.status(400).json({ message: "Invalid verification code !!!" });
    }

    if (user.verificationExpiry < Date.now()) {
      return res.status(400).json({ message: "Verification Code Expired !!!" });
    }

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;

    await user.save();

    // Tạo token sau khi verify thành công
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Email Verified Successfully !!!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};