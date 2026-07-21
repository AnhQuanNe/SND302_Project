import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/database.js";

import http from "http";
import { Server } from "socket.io";
import { setIO } from "./src/config/socket.js";

// ======================
// Connect MongoDB
// ======================
connectDB();

const PORT = process.env.PORT || 5000;

// ======================
// Create HTTP Server
// ======================
const server = http.createServer(app);

// ======================
// Socket.IO
// ======================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// lưu io để service sử dụng
setIO(io);

// khi client kết nối
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  console.log("Total clients:", io.engine.clientsCount);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    console.log("Total clients:", io.engine.clientsCount);
  });
});

// ======================
// Start Server
// ======================
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});