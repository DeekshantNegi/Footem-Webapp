import {User} from "../Models/users.model.js";
import {Turf} from "../Models/turfs.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";

export const getAllOwnerRequests = asyncHandler(async (req, res) => {
    const ownerRequests = await User.find({ isOwnerRequested: true });
    return res.status(200).json(new ApiResponse(200, ownerRequests, "Owner requests retrieved successfully"));
})
