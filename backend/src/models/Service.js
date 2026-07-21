import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    averageWaitingTime: Number,
    isActive: {
        type: Boolean,
        default: true
    },
  estimatedTime:{
    type:Number,
    default:10
}
});

export default mongoose.model("Service", serviceSchema);