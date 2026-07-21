import Service from "../models/Service.js";
import Queue from "../models/Queue.js";

export const getServices = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    if (isActive === "true") {
      filter.isActive = true;
    } else if (isActive === "false") {
      filter.isActive = false;
    }

    const services = await Service.find(filter);

    // Tính toán số người thực tế đang chờ trong MongoDB hàng đợi real-time
    const servicesWithRealData = await Promise.all(
      services.map(async (service) => {
        const waitingCount = await Queue.countDocuments({
          serviceId: service._id,
          status: "waiting",
        });

        return {
          ...service.toObject(),
          waitingCount, // Số người thực tế đang xếp hàng
        };
      })
    );

    res.status(200).json(servicesWithRealData);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching services",
      error: err.message,
    });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      averageWaitingTime,
      location,
      hotline,
      workingHours,
      requirements,
      isActive,
    } = req.body;

    const parsedRequirements = Array.isArray(requirements)
      ? requirements
      : typeof requirements === "string"
      ? requirements.split(",").map((r) => r.trim()).filter(Boolean)
      : [];

    const newService = await Service.create({
      name,
      description,
      averageWaitingTime: Number(averageWaitingTime) || 0,
      location: location || "",
      hotline: hotline || "",
      workingHours: workingHours || "",
      requirements: parsedRequirements,
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
    const {
      name,
      description,
      averageWaitingTime,
      location,
      hotline,
      workingHours,
      requirements,
      isActive,
    } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (averageWaitingTime !== undefined)
      updateFields.averageWaitingTime = Number(averageWaitingTime) || 0;
    if (location !== undefined) updateFields.location = location;
    if (hotline !== undefined) updateFields.hotline = hotline;
    if (workingHours !== undefined) updateFields.workingHours = workingHours;
    if (isActive !== undefined) updateFields.isActive = isActive;

    if (requirements !== undefined) {
      updateFields.requirements = Array.isArray(requirements)
        ? requirements
        : typeof requirements === "string"
        ? requirements.split(",").map((r) => r.trim()).filter(Boolean)
        : [];
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
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
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service locked successfully", service });
  } catch (err) {
    res.status(500).json({
      message: "Error locking service",
      error: err.message,
    });
  }
};

export const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    service.isActive = !service.isActive;
    await service.save();
    res.status(200).json({
      message: service.isActive
        ? "Service activated successfully"
        : "Service locked successfully",
      service,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error toggling service status",
      error: err.message,
    });
  }
};