import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  counterName: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },

  // Nhân viên phụ trách quầy
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
},
  {
    timestamps: true,
  }
);

export default mongoose.model("Counter", counterSchema);