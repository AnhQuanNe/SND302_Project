import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import serviceRoutes from "./routes/service.routes.js";
import authRoutes from "./routes/auth.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", routes);
app.use("/api/feedback", feedbackRoutes);

export default app;
