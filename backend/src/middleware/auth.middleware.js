import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Giải mã và xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user (loại bỏ password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Không tìm thấy người dùng." });
      }

      next();
    } catch (error) {
      console.error("Lỗi xác thực Token:", error);
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy Token xác thực." });
  }
};
