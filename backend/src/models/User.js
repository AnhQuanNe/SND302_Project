import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      default: "customer",
    },
    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active"
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      default: null,
    },

    verificationExpiry: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác", ""],
      default: "",
    },

    dob: {
      type: Date,
    },

    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);