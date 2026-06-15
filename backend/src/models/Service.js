import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    averageWaitingTime: Number,
    isActive: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Service", serviceSchema);