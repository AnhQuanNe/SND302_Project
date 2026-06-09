import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  counterName: String,
  status: {
    type: String,
    default: "open"
  }
});

export default mongoose.model("Counter", counterSchema);