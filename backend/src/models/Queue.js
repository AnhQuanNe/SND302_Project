import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
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

    // Thời điểm được gọi đến quầy
    calledAt: {
      type: Date,
      default: null,
    },

    // Thời điểm bắt đầu phục vụ
    servingAt: {
      type: Date,
      default: null,
    },

    // Thời điểm hoàn thành
    completedAt: {
      type: Date,
      default: null,
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
    enum: ["waiting", "serving", "done", "cancelled", "skipped"],
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