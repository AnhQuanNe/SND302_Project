import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  number: Number,
  status: {
    type: String,
    default: "waiting",
  },
});

export default mongoose.model("Queue", queueSchema);