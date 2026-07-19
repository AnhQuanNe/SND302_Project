import mongoose from "mongoose";

const queueHistorySchema = new mongoose.Schema({
    queueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Queue",
        required: true
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    queueNumber: Number,

    queueLength: Number,

    averageServiceTime: Number,

    staffCount: Number,

    counterCount: Number,

    hourOfDay: Number,

    dayOfWeek: Number,

    isPeakHour: Boolean,

    peakIntensity: Number,

    actualWaitTime: Number

}, {
    timestamps: true
});

export default mongoose.model("QueueHistory", queueHistorySchema);