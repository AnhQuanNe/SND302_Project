import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  "https://snd302-project.onrender.com";

const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

export default socket;