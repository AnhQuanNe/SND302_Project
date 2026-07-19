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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Queue", queueSchema);