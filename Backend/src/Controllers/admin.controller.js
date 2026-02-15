import { User } from "../Models/users.model.js";
import { Turf } from "../Models/turfs.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";

export const getAllOwnerRequests = asyncHandler(async (req, res) => {
  const ownerRequests = await User.find({ isOwnerRequested: true });
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
  const user = await User.findById(req.params.userId);
  if (!user || !user.isOwnerRequested) {
    throw new ApiError(404, "Owner request not found");
  }
  user.role = "owner";
  user.isOwnerRequested = false;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Owner request approved successfully"));
});
export const rejectOwner = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user || !user.isOwnerRequested) {
    throw new ApiError(404, "Owner request not found");
  }
  user.isOwnerRequested = false;
  user.ownerRequestDetails = undefined;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Owner request rejected"));
});
export const getAllTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find().populate("owner", "fullName email");
  return res
    .status(200)
    .json(new ApiResponse(200, turfs, "All turfs retrieved successfully"));
});
export const deleteTurf = async (req, res) => {
  const turf = await Turf.findByIdAndDelete(req.params.turfId);

  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  // Also remove turf ref from owner
  await User.findByIdAndUpdate(turf.owner, { turf: null });

  res.status(200).json(new ApiResponse(200, null, "Turf deleted successfully"));
};
