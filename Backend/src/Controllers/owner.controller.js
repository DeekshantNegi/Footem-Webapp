import { Owner } from "../Models/owners.model.js";
import ApiError from "../Utils/ApiError.js";
import APIresponse from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";

export const applyForOwner = asyncHandler(async (req, res) => {
  const { turfName, phone, location, businessLicenseNumber, idProof } = req.body;

  if (
    [turfName, phone, location, businessLicenseNumber, idProof].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existing = await Owner.findOne({ user: req.user._id });

  if (existing) {
    if (existing.status === "pending") {
      throw new ApiError(400, "You already have a pending owner request");
    }
    if (existing.status === "verified") {
      throw new ApiError(400, "You are already an approved owner");
    }

    // status === "rejected" — let them re-apply by updating the same record
    // instead of creating a duplicate, and reset it back to pending.
    existing.turfName = turfName;
    existing.phone = phone;
    existing.location = location;
    existing.businessLicenseNumber = businessLicenseNumber;
    existing.idProof = idProof;
    existing.status = "pending";
    existing.rejectionReason = undefined;
    await existing.save();

    return res
      .status(200)
      .json(new APIresponse(200, existing, "Owner request re-submitted successfully"));
  }

  const owner = await Owner.create({
    user: req.user._id,
    turfName,
    phone,
    location,
    businessLicenseNumber,
    idProof,
  });

  if (!owner) {
    throw new ApiError(500, "Failed to submit owner request");
  }

  return res
    .status(201)
    .json(new APIresponse(201, owner, "Owner request submitted successfully"));
});

export const getMyOwnerProfile = asyncHandler(async (req, res) => {
  const owner = await Owner.findOne({ user: req.user._id }).populate(
    "user",
    "fullName email",
  );
  if (!owner) {
    throw new ApiError(404, "Owner profile not found");
  }
  return res
    .status(200)
    .json(new APIresponse(200, owner, "Owner profile fetched successfully"));
});