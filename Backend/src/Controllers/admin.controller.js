import { User } from "../Models/users.model.js";
import { Owner } from "../Models/owners.model.js";
import { Turf } from "../Models/turfs.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { deleteFromCloudinary } from "../Utils/Cloudinary.js";


export const getAllOwnerRequests = asyncHandler(async (req, res) => {
  const ownerRequests = await Owner.find({status: "pending"}).populate("user", "fullName email");
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
  const owner = await Owner.findOne({user:req.params.userId});
  if (!owner) {
    throw new ApiError(404, "Owner request not found");
  }
  owner.status = "verified";
  await owner.save();
  return res
    .status(200)
    .json(new ApiResponse(200, owner, "Owner request approved successfully"));
});
export const rejectOwner = asyncHandler(async (req, res) => {
  const owner = await Owner.findById(req.params.id);
  if (!owner) {
    throw new ApiError(404, "Owner request not found");
  }
  owner.status = "rejected";
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

export const deleteTurf =  asyncHandler(async (req, res) => {
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
