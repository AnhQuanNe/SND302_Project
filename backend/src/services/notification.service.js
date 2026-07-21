import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type,
}) => {
  return await Notification.create({
    userId,
    title,
    message,
    type,
  });
};

export const getMyNotifications = async (userId) => {
  return await Notification.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

export const markAsRead = async (id, userId) => {
  return await Notification.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};