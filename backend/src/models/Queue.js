import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  number: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["waiting", "serving", "done", "cancelled"],
    default: "waiting",
  },
}, {
  timestamps: true, // 🔥 nên có
});

export default mongoose.model("Queue", queueSchema);