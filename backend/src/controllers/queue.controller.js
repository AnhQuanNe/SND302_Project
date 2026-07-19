import Queue from "../models/Queue.js";

export const createQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.id;

    // ❗ Check user đã có queue chưa
    const existingQueue = await Queue.findOne({
      userId,
      serviceId,
      status: "waiting",
    });

    if (existingQueue) {
      return res.status(400).json({
        message: "You already have a queue number",
        queue: existingQueue,
      });
    }

    // 🔥 Lấy số thứ tự mới (an toàn hơn count)
    const lastQueue = await Queue.findOne({ serviceId })
      .sort({ number: -1 });

    const nextNumber = lastQueue ? lastQueue.number + 1 : 1;

    const newQueue = await Queue.create({
      userId,
      serviceId,
      number: nextNumber,
    });

    res.status(201).json(newQueue);
  } catch (err) {
    res.status(500).json({
      message: "Error creating queue",
      error: err.message,
    });
  }
};

export const getMyQueue = async (req, res) => {
  try {
    const userId = req.user.id;

    const queue = await Queue.findOne({
      userId,
      status: { $in: ["waiting", "serving"] }
    }).populate("serviceId");

    res.json(queue);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching queue",
    });
  }
};

export const cancelQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { queueId } = req.params;

    const queue = await Queue.findOne({
      _id: queueId,
      userId,
    });

    if (!queue) {
      return res.status(404).json({
        message: "Queue not found",
      });
    }

    queue.status = "cancelled";
    await queue.save();

    res.json({ message: "Cancelled successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error cancelling queue",
    });
  }
};
//PUT /api/queue/:id/serve
export const serveQueue = async (req, res) => {

    const queue = await Queue.findById(req.params.id);

    if (!queue) {
        return res.status(404).json({
            message: "Queue not found"
        });
    }

    queue.status = "serving";

    // lưu thời điểm bắt đầu phục vụ
    queue.servingAt = new Date();

    await queue.save();

    res.json(queue);

}
//PUT /api/queue/:id/done
import QueueHistory from "../models/QueueHistory.js";
import Service from "../models/Service.js";
import Counter from "../models/Counter.js";
import User from "../models/User.js";

export const completeQueue = async (req, res) => {

    const queue = await Queue.findById(req.params.id);

    if (!queue) {
        return res.status(404).json({
            message: "Queue not found"
        });
    }

    queue.status = "done";

    await queue.save();

    // ========= AI DATA =========

    const service = await Service.findById(queue.serviceId);

    const queueLength = await Queue.countDocuments({
        serviceId: queue.serviceId
    });

    const staffCount = await User.countDocuments({
        role: "staff"
    });

    const counterCount = await Counter.countDocuments();

    const actualWaitTime =
        (queue.updatedAt - queue.createdAt) / 60000;

    const hour = queue.createdAt.getHours();

    const day = queue.createdAt.getDay();

    await QueueHistory.create({

        queueId: queue._id,

        serviceId: queue.serviceId,

        userId: queue.userId,

        queueNumber: queue.number,

        queueLength,

        averageServiceTime: service.averageServiceTime,

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

        actualWaitTime

    });

    res.json({
        message: "Completed"
    });

}