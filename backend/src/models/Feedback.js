import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    email:{
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    subject:{
        type: String
    },
    comment:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["pending", "resolved"],
        default: "pending"
    }
},
{
    timestamps: true
});

export default mongoose.model("Feedback", feedbackSchema);