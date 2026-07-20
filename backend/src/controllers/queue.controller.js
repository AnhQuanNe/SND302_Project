import Queue from "../models/Queue.js";
import mongoose from "mongoose";

export const createQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.id;

    // ❗ Kiểm tra xem user đã có vé nào đang chờ hoặc đang phục vụ trong hệ thống chưa
    const existingQueue = await Queue.findOne({
      userId,
      status: { $in: ["waiting", "serving"] },
    });

    if (existingQueue) {
      return res.status(400).json({
        message: "Bạn đã có một vé xếp hàng đang hoạt động. Vui lòng hoàn thành hoặc hủy vé hiện tại trước khi lấy vé mới!",
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
      status: { $in: ["waiting", "serving"] },
    }).populate("serviceId");

    if (!queue || !queue.serviceId) {
  return res.json(null);
}

    // số đang phục vụ
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

    const currentServing = currentQueue
        ? currentQueue.number
        : 0;

    const peopleAhead = await Queue.countDocuments({
        serviceId: queue.serviceId._id,
        status: "waiting",
        number: { $lt: queue.number },
    });

    res.json({
        ...queue.toObject(),
        currentServing,
        peopleAhead,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
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