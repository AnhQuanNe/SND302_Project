import mongoose from "mongoose";

const queueHistorySchema = new mongoose.Schema(
  {
    // Queue
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },

    queueNumber: {
      type: Number,
      required: true,
    },

    // User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Staff phục vụ
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Quầy phục vụ
    counterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counter",
      required: true,
    },

    // Dịch vụ
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // Thời điểm bắt đầu phục vụ
    servedAt: {
      type: Date,
      default: Date.now,
    },

    // Thời gian phục vụ (giây hoặc phút)
    duration: {
      type: Number,
      default: 0,
    },

    // ======================
    // AI Features
    // ======================

    // Số người đang chờ khi khách lấy số
    queueLength: {
      type: Number,
      default: 0,
    },

    // Thời gian phục vụ trung bình
    averageServiceTime: {
      type: Number,
      default: 0,
    },

    // Số nhân viên
    staffCount: {
      type: Number,
      default: 0,
    },

    // Số quầy hoạt động
    counterCount: {
      type: Number,
      default: 0,
    },

    // Giờ trong ngày
    hourOfDay: {
      type: Number,
      default: 0,
    },

    // Thứ trong tuần
    dayOfWeek: {
      type: Number,
      default: 0,
    },

    // Có phải giờ cao điểm không
    isPeakHour: {
      type: Boolean,
      default: false,
    },

    // Mức độ cao điểm
    peakIntensity: {
      type: Number,
      default: 0,
    },

    // Thời gian chờ thực tế (target để train AI)
    actualWaitTime: {
      type: Number,
      default: 0,
    },
    currentQueueCount:{
    type:Number,
    default:0
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QueueHistory", queueHistorySchema);