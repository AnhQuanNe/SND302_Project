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
      enum: ["waiting", "serving", "done", "cancelled", "skipped"],
      default: "waiting",
    },

    // Nhân viên đang phục vụ
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

    // Thời điểm gọi khách
    calledAt: {
      type: Date,
      default: null,
    },

    // Thời điểm hoàn thành
    finishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Queue", queueSchema);