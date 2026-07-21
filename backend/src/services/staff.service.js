import Queue from "../models/Queue.js";
import Counter from "../models/Counter.js";
import QueueHistory from "../models/QueueHistory.js";
import { getIO } from "../config/socket.js";
import { createNotification } from "./notification.service.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

/**
 * Gọi khách tiếp theo
 * @param {String} staffId - ID của nhân viên đăng nhập
 */
export const callNextQueue = async (staffId) => {
  console.log("\n========== CALL NEXT ==========");
  console.log("Staff:", staffId);

  // Kiểm tra tất cả queue
  const allQueues = await Queue.find().lean();
  console.log("All Queues:");
  console.log(allQueues);

  // Kiểm tra queue waiting
  const waitingQueues = await Queue.find({
    status: "waiting",
  }).lean();

  console.log("Waiting Queues:");
  console.log(waitingQueues);

  // Kiểm tra counter
  const counter = await Counter.findOne({
    staffId,
    status: "open",
  });

  console.log("Counter:");
  console.log(counter);

  // Kiểm tra queue hiện tại của staff
  const currentQueue = await Queue.findOne({
    staffId,
    status: "serving",
  });

  console.log("Current Queue:");
  console.log(currentQueue);

  // Queue sẽ được gọi
  const nextQueue = await Queue.findOne({
    status: "waiting",
  }).sort({ number: 1 });

  console.log("Next Queue:");
  console.log(nextQueue);

  if (!counter) {
    throw new Error("Bạn chưa được phân công quầy hoặc quầy đang đóng.");
  }

  if (currentQueue) {
    throw new Error("Bạn đang phục vụ một khách khác.");
  }

  if (!nextQueue) {
    throw new Error("Không còn khách đang chờ.");
  }

  nextQueue.status = "serving";
  nextQueue.staffId = staffId;
  nextQueue.counterId = counter._id;
  nextQueue.calledAt = new Date();

  console.log("Before Save:");
  console.log(nextQueue);

  await nextQueue.save();
  await createNotification({
    userId: nextQueue.userId,
    title: "Đến lượt giao dịch",
    message: `Số ${nextQueue.number} đã được gọi.`,
    type: "called",
});
  // ===== SOCKET.IO =====
// Thông báo cho Customer biết đã đến lượt
getIO().emit("queueCalled", {
  queueId: nextQueue._id,
  userId: nextQueue.userId.toString(),
  number: nextQueue.number,
  counterId: counter._id,
});
console.log("Emit queueCalled", {
    userId: nextQueue.userId,
    number: nextQueue.number
});
  console.log("Saved Successfully");

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
  await createNotification({
    userId: queue.userId,
    title: "Hoàn thành",
    message: "Giao dịch của bạn đã hoàn tất.",
    type: "completed",
});
  // ===== SOCKET.IO =====
// Thông báo phục vụ hoàn tất
const io = getIO();

console.log("Socket connected:", io.engine.clientsCount);
console.log("Emit completed to", io.engine.clientsCount, "clients");


io.emit("queueCompleted", {
  queueId: queue._id.toString(),
  userId: queue.userId.toString(),
  number: queue.number,
});

console.log("Emit queueCompleted");
console.log("Emit queueCompleted", {
    userId: queue.userId,
    number: queue.number
});
const service = await Service.findById(queue.serviceId);

const queueLength = await Queue.countDocuments({
    serviceId: queue.serviceId,
    status: "waiting"
});

const staffCount = await User.countDocuments({
    role: "staff"
});

const counterCount = await Counter.countDocuments({
    status: "open"
});

const hour = queue.createdAt.getHours();

const day = queue.createdAt.getDay();

const actualWaitTime =
    (queue.calledAt - queue.createdAt) / 60000;
  // Lưu lịch sử
  await QueueHistory.create({

    queueId: queue._id,
    queueNumber: queue.number,

    userId: queue.userId,
    serviceId: queue.serviceId,

    counterId: queue.counterId,
    staffId: queue.staffId,

    servedAt: queue.finishedAt,

    duration:
        (queue.finishedAt - queue.calledAt) / 60000,

    queueLength,

    averageServiceTime:
        service.estimatedTime,

    staffCount,

    counterCount,

    hourOfDay: hour,

    dayOfWeek: day,

    isPeakHour:
        (hour >= 11 && hour <= 13) ||
        (hour >= 17 && hour <= 19),

    peakIntensity:
        (hour >= 11 && hour <= 13) ||
        (hour >= 17 && hour <= 19)
            ? 1
            : 0,

    actualWaitTime,

    currentQueueCount: queueLength

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
  await createNotification({
    userId: queue.userId,
    title: "Đã bỏ qua",
    message: "Số của bạn đã bị bỏ qua.",
    type: "skipped",
});
  // ===== SOCKET.IO =====
getIO().emit("queueSkipped", {
  queueId: queue._id,
  userId: queue.userId.toString(),
  number: queue.number,
});
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
  await createNotification({
    userId: queue.userId,
    title: "Được gọi lại",
    message: `Mời bạn quay lại quầy giao dịch.`,
    type: "recalled",
});
// ===== SOCKET.IO =====
getIO().emit("queueRecalled", {
  queueId: queue._id,
  userId: queue.userId.toString(),
  number: queue.number,
});
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