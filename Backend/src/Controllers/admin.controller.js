import { User } from "../Models/users.model.js";
import { Owner } from "../Models/owners.model.js";
import { Turf } from "../Models/turfs.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { deleteFromCloudinary } from "../Utils/Cloudinary.js";

export const getAllOwnerRequests = asyncHandler(async (req, res) => {
  const { status = "pending" } = req.query;

  const validStatuses = ["pending", "verified", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `status must be one of: ${validStatuses.join(", ")}`);
  }

  const ownerRequests = await Owner.find({ status }).populate(
    "user",
    "fullName email",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ownerRequests,
        "Owner requests retrieved successfully",
      ),
    );
});

export const approveOwner = asyncHandler(async (req, res) => {
  const owner = await Owner.findOne({ user: req.params.userId });
  if (!owner) {
    throw new ApiError(404, "Owner request not found");
  }
  if (owner.status !== "pending") {
    throw new ApiError(400, `This request has already been ${owner.status}`);
  }

  owner.status = "verified";
  await owner.save();

  // Promote the underlying user so role-gated routes (e.g. "add a turf") open up.
  await User.findByIdAndUpdate(owner.user, { role: "owner" });

  return res
    .status(200)
    .json(new ApiResponse(200, owner, "Owner request approved successfully"));
});

export const rejectOwner = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const owner = await Owner.findOne({ user: req.params.userId });
  if (!owner) {
    throw new ApiError(404, "Owner request not found");
  }
  if (owner.status !== "pending") {
    throw new ApiError(400, `This request has already been ${owner.status}`);
  }

  owner.status = "rejected";
  if (reason) owner.rejectionReason = reason;
  await owner.save();

  return res
    .status(200)
    .json(new ApiResponse(200, owner, "Owner request rejected"));
});

export const getAllTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find().populate("owner", "fullName email");
  return res
    .status(200)
    .json(new ApiResponse(200, turfs, "All turfs retrieved successfully"));
});

export const deleteTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params?.turfId);

  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  // Delete images from Cloudinary
  if (turf.images && turf.images.length > 0) {
    await deleteFromCloudinary(turf.images);
  }
  await Turf.findByIdAndDelete(req.params?.turfId);

  return res.status(200).json(new ApiResponse(200, {}, "Turf deleted successfully"));
});