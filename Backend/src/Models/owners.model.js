import mongoose from "mongoose";

const ownerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    turfName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    businessLicenseNumber: {
      type: String,
      required: true,
    },
    idProof: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Owner= mongoose.model("Owner", ownerProfileSchema);
