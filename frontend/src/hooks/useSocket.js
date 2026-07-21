import { useEffect } from "react";
import socket from "../socket/socket";

const useSocket = (
    currentUser,
    reloadQueue,
    reloadNotifications
) => {

    useEffect(() => {
    if (!currentUser?._id) return;

    const handleCalled = async (data) => {
        console.log("handleCalled", data);

        if (String(data.userId) !== String(currentUser._id)) return;

        alert(`Đến lượt số ${data.number}`);

        await reloadNotifications();
        await reloadQueue();
    };

    const handleCompleted = async (data) => {
        console.log("handleCompleted", data);

        if (String(data.userId) !== String(currentUser._id)) return;

        alert("Hoàn thành");

        await reloadNotifications();
        await reloadQueue();
    };

    socket.off("queueCalled");
    socket.off("queueCompleted");
    socket.off("queueSkipped");
    socket.off("queueRecalled");

    socket.on("queueCalled", handleCalled);
    socket.on("queueCompleted", handleCompleted);

    return () => {
        socket.off("queueCalled", handleCalled);
        socket.off("queueCompleted", handleCompleted);
    };

}, [
    currentUser?._id,
    reloadQueue,
    reloadNotifications
]);

};

export default useSocket;