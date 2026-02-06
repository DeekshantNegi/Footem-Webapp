import mongoose from "mongoose";

const Turfschema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    Turfname: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "", // check what happens if description is not provided for experimental purposes
    },
    priceperhour: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    turfType: {
      type: String,
      enum: ["5v5", "6v6", "7v7", "8v8", "9v9", "11v11"],
    },
    images: [
      {
        type: String,
      },
    ],
    amenities: [String],
    openTime: {
      type: String,
    },
    closeTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Turf = mongoose.model("Turf", Turfschema);
