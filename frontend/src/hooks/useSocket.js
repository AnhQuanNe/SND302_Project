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
  console.log("===== RECEIVED queueCompleted =====");
  console.log(data);
  console.log("Current user:", currentUser);

  if (String(data.userId) !== String(currentUser._id)) {
    console.log("User không khớp");
    return;
  }

  console.log("ĐÚNG USER -> chuyển Feedback");

  onQueueCompleted?.(data);

  try {
    await reloadQueue();
    await reloadNotifications();
  } catch (e) {
    console.error(e);
  }
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