import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import notificationRoute from "./routes/notification.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Test route works",
  });
});

// Tất cả API đi qua index.js
app.use("/api", routes);

// Route riêng
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoute);

console.log("Express routes loaded");

export default app;