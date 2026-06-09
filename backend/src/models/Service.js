import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  estimatedTime: Number
});

export default mongoose.model("Service", serviceSchema);