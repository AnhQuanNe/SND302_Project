import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { setIO } from "./src/config/socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

setIO(io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  console.log("Total clients:", io.engine.clientsCount);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    console.log("Total clients:", io.engine.clientsCount);
  });
});

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();