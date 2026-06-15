import Queue from "../models/Queue.js";

export const createQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;

    // đếm số queue hiện tại của service
    const count = await Queue.countDocuments({ serviceId });

    const newQueue = await Queue.create({
      serviceId,
      number: count + 1,
    });

    res.status(201).json(newQueue);
  } catch (err) {
    res.status(500).json({
      message: "Error creating queue",
      error: err.message,
    });
  }
};