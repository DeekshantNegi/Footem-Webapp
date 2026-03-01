import Owner from "../Models/owner.model.js";
import ApiError from "../Utils/ApiError.js";
import APIresponse from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";

export const applyForOwner = asyncHandler(async (req, res)=>{
  const { turfName, phone, location, businessLicenseNumber, idProof } = req.body;
    if ([turfName, phone, location, businessLicenseNumber, idProof].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const existing = await Owner.findOne({ user: req.user._id});
    if(existing){
        throw new ApiError(400, "You have already applied for owner");
    }
    const owner = await Owner.create({
        user: req.user._id,
        turfName,
        phone,
        location,
        businessLicenseNumber,
        idProof
    });
    if(!owner){
        throw new ApiError(500, "Failed to submit owner request");
    }

    return res.status(200)
    .json(new APIresponse(200, owner, "Owner request submitted successfully"));
});

 export const getMyOwnerProfile = asyncHandler(async(req,res)=>{
  const owner = await Owner.findOne({ user: req.user._id}).populate("user", "fullName email");
  if(!owner){
    throw new ApiError(404, "Owner profile not found");
  }
  return res.status(200)
  .json(new APIresponse(200, owner, "Owner profile fetched successfully"));
})