import Queue from "../models/Queue.js";
import mongoose from "mongoose";
import { predictWaitTime } from "../services/aiPrediction.service.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Counter from "../models/Counter.js";
import QueueHistory from "../models/QueueHistory.js";
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
    const service = await Service.findById(serviceId);

const waitingCount = await Queue.countDocuments({
    serviceId,
    status: "waiting"
});

const staffCount = await User.countDocuments({
    role: "staff"
});

const counterCount = await Counter.countDocuments({
    status: "open"
});

const ai = await predictWaitTime({

    serviceId,

    currentQueueCount: waitingCount,

    averageServiceTime: service.estimatedTime || 10,

    staffCount,

    counterCount,

    hourOfDay: new Date().getHours(),

    dayOfWeek: new Date().getDay()

});

  res.status(201).json({
    ...newQueue.toObject(),
    predictedWaitTime: ai.predictedWaitTime
});
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
      status: { $in: ["waiting", "serving"] },
    }).populate("serviceId");

    // Người dùng chưa có vé
    if (!queue) {
      return res.status(200).json(null);
    }

    // Queue cũ đang tham chiếu tới service đã bị xóa
    if (!queue.serviceId) {
      await Queue.findByIdAndUpdate(queue._id, {
        status: "cancelled",
      });

      return res.status(200).json(null);
    }

    let currentQueue = await Queue.findOne({
      serviceId: queue.serviceId._id,
      status: "serving",
    }).sort({ number: -1 });

    if (!currentQueue) {
      currentQueue = await Queue.findOne({
        serviceId: queue.serviceId._id,
        status: "done",
      }).sort({ number: -1 });
    }

    const currentServing = currentQueue ? currentQueue.number : 0;

    const peopleAhead = await Queue.countDocuments({
      serviceId: queue.serviceId._id,
      status: "waiting",
      number: { $lt: queue.number },
    });

    const waitingCount = await Queue.countDocuments({
      serviceId: queue.serviceId._id,
      status: "waiting",
    });

    const staffCount = await User.countDocuments({
      role: "staff",
    });

    const counterCount = await Counter.countDocuments({
      status: "open",
    });

    const ai = await predictWaitTime({
      serviceId: queue.serviceId._id.toString(),
      currentQueueCount: waitingCount,
      averageServiceTime: queue.serviceId.estimatedTime || 10,
      staffCount,
      counterCount,
      hourOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
    });

    return res.status(200).json({
      ...queue.toObject(),
      currentServing,
      peopleAhead,
      predictedWaitTime: ai?.predictedWaitTime ?? null,
    });
  } catch (err) {
    console.error("GET MY QUEUE ERROR:", err);

    return res.status(500).json({
      message: "Error getting queue",
      error: err.message,
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

// ===========================
// ADMIN - GET ALL QUEUES
// ===========================
export const getAllQueues = async (req, res) => {
  try {

    const {
      status,
      serviceId,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Filter theo trạng thái
    if (status) {
      filter.status = status;
    }

    // Filter theo dịch vụ
    if (serviceId) {
      filter.serviceId = serviceId;
    }

    // Tìm theo số queue
    if (search) {
      filter.number = Number(search);
    }

    const currentPage = Number(page);
    const pageSize = Number(limit);

    const total = await Queue.countDocuments(filter);
    const queues = await Queue.find(filter)
      .populate("userId", "fullName email")
      .populate("serviceId", "name")
      .populate("counterId", "name")
      .populate("staffId", "fullName")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      pagination: {
          total,
          page: currentPage,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
      },
      data: queues,
  });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ===========================
// ADMIN - QUEUE STATISTICS
// ===========================
export const getQueueStatistics = async (req, res) => {
  try {
    const statuses = [
      "waiting",
      "serving",
      "done",
      "cancelled",
      "skipped",
    ];
    const statistics = {};

    for (const status of statuses) {
      statistics[status] = await Queue.countDocuments({ status });
    }
    statistics.total = await Queue.countDocuments();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// ADMIN - GET QUEUE DETAIL
// ===========================
export const getQueueDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const queue = await Queue.findById(id)
      .populate("userId", "fullName email phone")
      .populate("serviceId")
      .populate("counterId")
      .populate("staffId", "fullName email");

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// ADMIN - UPDATE QUEUE STATUS
// ===========================
export const updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = [
      "waiting",
      "serving",
      "done",
      "cancelled",
      "skipped",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const queue = await Queue.findById(id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    queue.status = status;

    if (status === "serving") {
      queue.calledAt = new Date();
    }

    if (status === "done") {
      queue.finishedAt = new Date();
    }

    await queue.save();

    res.status(200).json({
      success: true,
      message: "Queue status updated successfully",
      data: queue,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// ADMIN - TRANSFER QUEUE
// ===========================
export const transferQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const { counterId, staffId } = req.body;
    const queue = await Queue.findById(id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    // Nếu client gửi thì mới cập nhật
    if (counterId) {
      queue.counterId = counterId;
    }

    if (staffId) {
      queue.staffId = staffId;
    }

    await queue.save();
    const updatedQueue = await Queue.findById(queue._id)
      .populate("userId", "fullName email")
      .populate("serviceId", "name")
      .populate("counterId", "name")
      .populate("staffId", "fullName email");
    res.status(200).json({
      success: true,
      message: "Queue transferred successfully",
      data: updatedQueue,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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

if (!service) {
    return res.status(404).json({
        message: "Service not found"
    });
}

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

        averageServiceTime: service.estimatedTime || 10,

        staffCount,

        counterCount,
        currentQueueCount: queueLength,

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
