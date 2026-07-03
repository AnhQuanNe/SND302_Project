import mongoose from "mongoose";

const queueHistorySchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    counterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counter",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    queueNumber: {
      type: Number,
      required: true,
    },

    servedAt: {
      type: Date,
      default: Date.now,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QueueHistory", queueHistorySchema);