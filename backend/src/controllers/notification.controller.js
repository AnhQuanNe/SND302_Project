import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
  try {
    const data = await notificationService.getMyNotifications(
      req.user._id
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const readNotification = async (req, res) => {
  try {
    const data = await notificationService.markAsRead(
      req.params.id,
      req.user._id
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};