import { useEffect } from "react";
import socket from "../socket/socket";

const useSocket = (
  currentUser,
  reloadQueue,
  reloadNotifications,
  onQueueCompleted
) => {
  useEffect(() => {
    const currentUserId =
      currentUser?._id || currentUser?.id;

    console.log("CURRENT USER:", currentUser);
    console.log("CURRENT USER ID:", currentUserId);

    if (!currentUserId) {
      console.log("Không có userId nên chưa đăng ký socket listener");
      return;
    }

    const handleCalled = async (data) => {
      console.log("RECEIVED queueCalled:", data);

      if (
        String(data.userId) !== String(currentUserId)
      ) {
        return;
      }

      alert(`Đến lượt số ${data.number}`);

      try {
        await reloadNotifications();
        await reloadQueue();
      } catch (error) {
        console.error("Reload queueCalled error:", error);
      }
    };

    const handleCompleted = async (data) => {
      console.log("===== RECEIVED queueCompleted =====");
      console.log("Event data:", data);
      console.log("Current user ID:", currentUserId);

      if (
        String(data.userId) !== String(currentUserId)
      ) {
        console.log("Không đúng user");
        return;
      }

      console.log("Đúng user, chuyển sang Feedback");

      // Chuyển trang ngay trước khi reload API
      onQueueCompleted?.(data);

      alert(
        "Giao dịch đã hoàn thành. Vui lòng đánh giá dịch vụ."
      );

      try {
        await reloadQueue();
        await reloadNotifications();
      } catch (error) {
        console.error(
          "Reload after complete error:",
          error
        );
      }
    };

    socket.on("queueCalled", handleCalled);
    socket.on("queueCompleted", (data) => {
    console.log("🔥 NHẬN queueCompleted:", data);
});
    socket.on("queueCompleted", handleCompleted);

    return () => {
      socket.off("queueCalled", handleCalled);
      socket.off("queueCompleted", handleCompleted);
    };
  }, [
    currentUser?._id,
    currentUser?.id,
    reloadQueue,
    reloadNotifications,
    onQueueCompleted,
  ]);
};

export default useSocket;