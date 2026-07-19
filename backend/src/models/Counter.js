import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  counterName: {
    type: String,
    required: true,
    unique: true,
  },

  status: {
    type: String,
    enum: ["open", "closed"],
    default: "closed",
  },

  // Nhân viên phụ trách quầy
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // trạng thái tồn tại của quầy
  isActive: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: true,
  }
);

export default mongoose.model("Counter", counterSchema);