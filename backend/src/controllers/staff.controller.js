import { callNextQueue } from "../services/staff.service.js";

/**
 * Gọi khách tiếp theo
 * POST /api/staff/next
 */
export const nextQueue = async (req, res) => {
  try {
    // ID của staff lấy từ middleware xác thực
    const staffId = req.user.id;

    const queue = await callNextQueue(staffId);

    return res.status(200).json({
      success: true,
      message: "Gọi khách tiếp theo thành công.",
      data: queue,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};