import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.utils.js";
import { sendVerificationEmail } from "../services/email.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.verified){
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
      verificationCode,
      verificationExpiry: Date.now() + 10 * 60 * 1000
    });

    //Send email OTP
    await sendVerificationEmail(user.email, verificationCode);

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

//VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try{
    const {email, code} = req.body;
    const user = await User.findOne({email})

    if (!user){
      return res.status(404).json({
        message: "User Not Found !!!"
      });
    }

    if (user.verificationCode !== code){
      return res.status(400).json({
        message: "Invalid verification code !!!"
      });
    }

    if (user.verificationExpiry < Date.now()){
      return res.status(400).json({
        message: "Verification Code Expired !!!"
      });
    }

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;

    await user.save();
    res.status(200).json({
      message: "Email Verified Successfully !!!"
    });
  }catch (error){
    res.status(500).json({
      message: error.message
    })
  }
}

//GUI LAI OTP NEU HET HAN
export const resendOTP = async (req, res) => {
  try{
    const {email} = req.body;
    const user = await User.findOne({email});

    if (!user){
      return res.status(404).json({
        message: "User not found !!!"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified"
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verificationCode = verificationCode;
    user.verificationExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendVerificationEmail(
      user.email,
      verificationCode
    );

    res.json({
      message: "New OTP has been sent"
    });
  }catch (error){
    res.status(500).json({
      message: error.message
    });
  }
}