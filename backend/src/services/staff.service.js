import Queue from "../models/Queue.js";
import Counter from "../models/Counter.js";

/**
 * Gọi khách tiếp theo
 * @param {String} staffId - ID của nhân viên đăng nhập
 */
export const callNextQueue = async (staffId) => {
  // Tìm quầy mà staff đang phụ trách
  const counter = await Counter.findOne({
    staffId,
    status: "open",
  });

  if (!counter) {
    throw new Error("Bạn chưa được phân công quầy hoặc quầy đang đóng.");
  }

  // Kiểm tra staff có đang phục vụ khách không
  const currentQueue = await Queue.findOne({
    staffId,
    status: "serving",
  });

  if (currentQueue) {
    throw new Error("Bạn đang phục vụ một khách khác.");
  }

  // Lấy số nhỏ nhất đang chờ
  const nextQueue = await Queue.findOne({
    status: "waiting",
  }).sort({ number: 1 });

  if (!nextQueue) {
    throw new Error("Không còn khách đang chờ.");
  }

  // Cập nhật trạng thái
  nextQueue.status = "serving";
  nextQueue.staffId = staffId;
  nextQueue.counterId = counter._id;
  nextQueue.calledAt = new Date();

  await nextQueue.save();

  // Trả về đầy đủ thông tin
  return await Queue.findById(nextQueue._id)
    .populate("userId", "fullName email")
    .populate("serviceId")
    .populate("counterId");
};