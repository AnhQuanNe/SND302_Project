import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();

    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching services",
      error: err.message,
    });
  }
};