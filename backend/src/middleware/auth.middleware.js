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

      // Giải mã và xác thực token (lấy ra id và iat - thời điểm tạo token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user (loại bỏ password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Không tìm thấy người dùng." });
      }

      // 🚀 CHỐT CHẶN 1: KIỂM TRA TÀI KHOẢN CÓ ĐANG BỊ KHÓA KHÔNG
      // Nếu trạng thái không phải là active (ví dụ: inactive, banned), chặn ngay lập tức
      if (req.user.status !== "active") {
        return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa bởi Admin!" });
      }

      // 🚀 CHỐT CHẶN 2: KIỂM TRA MẬT KHẨU CÓ BỊ ADMIN THU HỒI / RESET KHÔNG
      // So sánh thời điểm phát hành Token (decoded.iat) với thời điểm đổi pass gần nhất
      if (req.user.passwordChangedAt) {
        // Chuyển đổi passwordChangedAt sang định dạng Timestamp (giây) giống với JWT
        const changedTimestamp = parseInt(req.user.passwordChangedAt.getTime() / 1000, 10);
        
        // Nếu Token được tạo TRƯỚC khi mật khẩu bị đổi -> Token vô hiệu
        if (decoded.iat < changedTimestamp) {
          return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn hoặc mật khẩu đã bị thay đổi. Vui lòng đăng nhập lại!" });
        }
      }

      // Nếu vượt qua mọi chốt chặn, cho phép đi tiếp
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