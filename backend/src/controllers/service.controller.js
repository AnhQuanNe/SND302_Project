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

export const createService = async (req, res) => {
  try {
    const { name, description, averageWaitingTime, isActive } = req.body;
    const newService = await Service.create({
      name,
      description,
      averageWaitingTime: averageWaitingTime || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({
      message: "Error creating service",
      error: err.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { name, description, averageWaitingTime, isActive } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, averageWaitingTime, isActive },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(updatedService);
  } catch (err) {
    res.status(500).json({
      message: "Error updating service",
      error: err.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting service",
      error: err.message,
    });
  }
};