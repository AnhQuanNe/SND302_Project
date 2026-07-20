import Queue from "../models/Queue.js";
import Counter from "../models/Counter.js";
import QueueHistory from "../models/QueueHistory.js";

/**
 * Gọi khách tiếp theo (FIFO theo thời gian đến)
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

  // Lấy khách đến sớm nhất và cập nhật luôn trạng thái
  const nextQueue = await Queue.findOneAndUpdate(
    {
      status: "waiting",
    },
    {
      $set: {
        status: "serving",
        staffId,
        counterId: counter._id,
        calledAt: new Date(),
      },
    },
    {
      sort: { createdAt: 1 }, // FIFO
      new: true,
    }
  );

  if (!nextQueue) {
    throw new Error("Không còn khách đang chờ.");
  }

  // Trả về đầy đủ thông tin
  return await Queue.findById(nextQueue._id)
    .populate("userId", "fullName email")
    .populate("serviceId")
    .populate("counterId");
};

export const completeQueue = async (queueId, staffId) => {
  // Tìm queue
  const queue = await Queue.findById(queueId);

  if (!queue) {
    throw new Error("Không tìm thấy hàng chờ.");
  }

  // Kiểm tra quyền
  if (queue.staffId.toString() !== staffId.toString()) {
    throw new Error("Bạn không có quyền xử lý hàng chờ này.");
  }

  // Chỉ được hoàn thành queue đang phục vụ
  if (queue.status !== "serving") {
    throw new Error("Hàng chờ không ở trạng thái đang phục vụ.");
  }

  // Cập nhật trạng thái
  queue.status = "done";
  queue.finishedAt = new Date();

  await queue.save();

  // Lưu lịch sử
  await QueueHistory.create({
    queueId: queue._id,
    queueNumber: queue.number,
    userId: queue.userId,
    serviceId: queue.serviceId,
    counterId: queue.counterId,
    staffId: queue.staffId,

    servedAt: queue.finishedAt,

    duration: Math.floor(
      (queue.finishedAt - queue.calledAt) / 1000
    ),
  });

  return queue;
};

export const getCurrentQueue = async (staffId) => {
  const queue = await Queue.findOne({
    staffId,
    status: "serving",
  })
    .populate("userId", "fullName email")
    .populate("serviceId")
    .populate("counterId");

  // if (!queue) {
  //   throw new Error("Hiện tại bạn không phục vụ khách nào.");
  // }

  return queue;
};

export const skipQueue = async (queueId, staffId) => {
  const queue = await Queue.findById(queueId);

  if (!queue) {
    throw new Error("Không tìm thấy hàng chờ.");
  }

  // Chỉ được skip khi đang phục vụ
  if (queue.status !== "serving") {
    throw new Error("Chỉ có thể bỏ qua hàng chờ đang phục vụ.");
  }

  // Queue chưa được gán cho staff
  if (!queue.staffId) {
    throw new Error("Hàng chờ chưa được gán cho nhân viên.");
  }

  // Kiểm tra queue có thuộc staff này không
  if (queue.staffId.toString() !== staffId.toString()) {
    throw new Error("Bạn không có quyền bỏ qua hàng chờ này.");
  }

  // Cập nhật trạng thái
  queue.status = "skipped";

  await queue.save();

  return queue;
};

export const recallQueue = async (queueId, staffId) => {
  const queue = await Queue.findById(queueId);

  if (!queue) {
    throw new Error("Không tìm thấy hàng chờ.");
  }

  // Chỉ được gọi lại queue đã skip
  if (queue.status !== "skipped") {
    throw new Error("Chỉ có thể gọi lại hàng chờ đã bị bỏ qua.");
  }

  // Kiểm tra đã được gán cho staff chưa
  if (!queue.staffId) {
    throw new Error("Hàng chờ chưa được gán cho nhân viên.");
  }

  // Kiểm tra quyền
  if (queue.staffId.toString() !== staffId.toString()) {
    throw new Error("Bạn không có quyền gọi lại hàng chờ này.");
  }

  // Chuyển lại trạng thái phục vụ
  queue.status = "serving";
  queue.calledAt = new Date();

  await queue.save();

  return await Queue.findById(queue._id)
    .populate("userId", "fullName email")
    .populate("serviceId")
    .populate("counterId");
};

export const updateCounterStatus = async (staffId, status) => {
  if (!["open", "closed"].includes(status)) {
    throw new Error("Trạng thái quầy không hợp lệ.");
  }

  const counter = await Counter.findOne({ staffId });

  if (!counter) {
    throw new Error("Không tìm thấy quầy của nhân viên.");
  }

  counter.status = status;

  await counter.save();

  return counter;
};

export const getCounterInfo = async (staffId) => {
  const counter = await Counter.findOne({ staffId })
    .select("counterName status");

  if (!counter) {
    throw new Error("Không tìm thấy quầy của nhân viên.");
  }

  return counter;
};

export const getSkippedQueues = async (staffId) => {
  return await Queue.find({
    staffId,
    status: "skipped",
  })
    .populate("userId", "fullName email")
    .populate("serviceId", "name estimatedTime")
    .sort({ updatedAt: -1 });
};

/**
 * Lấy lịch sử xử lý queue của staff
 * @param {String} staffId
 */
export const getQueueHistory = async (staffId) => {
  return await QueueHistory.find({
    staffId,
  })
    .populate("userId", "fullName email")
    .populate("serviceId", "name")
    .populate("counterId", "counterName")
    .sort({ servedAt: -1 });
};