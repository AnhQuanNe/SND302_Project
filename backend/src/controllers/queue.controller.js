import Queue from "../models/Queue.js";
import mongoose from "mongoose";

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
      status: { $in: ["waiting", "serving"] },
    }).populate("serviceId");

    if (!queue) {
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