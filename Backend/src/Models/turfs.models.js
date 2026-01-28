import mongoose from "mongoose";

const Turfschema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  },
  description: {
    type: String,
  },
  priceperhour: {
    type: Number,
    required: true,
  },
  turfType: {
    type: String,
    enum: ["5v5", "6v6", "7v7", "8v8", "9v9", "11v11"],
  },
  images: [String],
  amenities: [String],
  openTime: {
    type: String,
  },
  closeTime: {
    type: String,
  }
  
}, {
    timestamps: true,
});

export const Turfs = mongoose.model("Turf", Turfschema);
