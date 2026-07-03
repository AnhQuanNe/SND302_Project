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

  // Staff đang phục vụ
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Quầy đang phục vụ
  counterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Counter",
    default: null,
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

  // Thời điểm nhân viên gọi số
  calledAt: {
    type: Date,
    default: null,
  },

  // Thời điểm hoàn thành
  finishedAt: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true, // 🔥 nên có
});

export default mongoose.model("Queue", queueSchema);