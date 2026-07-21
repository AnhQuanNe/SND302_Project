import { useEffect } from "react";
import socket from "../socket/socket";

const useSocket = (
  currentUser,
  reloadQueue,
  reloadNotifications,
  onQueueCompleted
) => {
  useEffect(() => {
    if (!currentUser?._id) return;

    const handleCalled = async (data) => {
      if (
        String(data.userId) !== String(currentUser._id)
      ) {
        return;
      }

      alert(`Đến lượt số ${data.number}`);

      await reloadNotifications();
      await reloadQueue();
    };

    const handleCompleted = async (data) => {
      if (
        String(data.userId) !== String(currentUser._id)
      ) {
        return;
      }

      alert("Giao dịch đã hoàn thành. Vui lòng đánh giá dịch vụ.");

      // Xóa vé và tải thông báo mới
      await reloadQueue();
      await reloadNotifications();

      // Chuyển sang Feedback
      onQueueCompleted?.(data);
    };

    socket.on("queueCalled", handleCalled);
    socket.on("queueCompleted", handleCompleted);

    return () => {
      socket.off("queueCalled", handleCalled);
      socket.off("queueCompleted", handleCompleted);
    };
  }, [
    currentUser?._id,
    reloadQueue,
    reloadNotifications,
    onQueueCompleted,
  ]);
};

export default useSocket;