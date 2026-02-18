import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { User } from "../Models/users.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../Utils/Cloudinary.js";
import { Turf } from "../Models/turfs.model.js";

//create turf
const createTurf = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ✅ Only approved owners can create turf
  if (user.role !== "owner") {
    throw new ApiError(403, "Only owners can create turf");
  }
  const {
    turfName,
    location,
    city,
    description,
    priceperhour,
    turfType,
    amenities,
    openTime,
    closeTime,
  } = req.body;
  if (
    [turfName, location, city, priceperhour].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  let uploadedImages = [];
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one turf image is required");
  }
  if (req.files || req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path, "turfs");
      uploadedImages.push(uploaded);
    }
  }

  const turf = await Turf.create({
    owner: req.user._id,
    turfName,
    location,
    city,
    description,
    priceperhour,
    turfType,
    amenities,
    openTime,
    closeTime,
    images: uploadedImages,
  });
  if (!turf) {
    throw new ApiError(500, "Failed to create turf");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, turf, "Turf created successfully"));
});

// get single turf
const getSingleTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id).populate(
    "owner",
    "fullName email",
  );
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, turf, "Turf retrieved successfully"));
});

//update turf

const updateTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }
  if (turf.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this turf");
  }
  const [
    turfName,
    location,
    city,
    description,
    priceperhour,
    turfType,
    amenities,
    openTime,
    closeTime,
  ] = req.body;

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      turf[field] = req.body[field];
    }
  });

  if (req.files && req.files.length > 0) {
    //delete old images from cloudinary
    await deleteFromCloudinary(turf.images);
  }
  let newImages = [];
  for (const file of req.files) {
    const uploaded = await uploadOnCloudinary(file.path, "turfs");
    newImages.push(uploaded);

    turf.images = newImages;
  }
  await turf.save();

  return res
    .status(200)
    .json(new ApiResponse(200, turf, "Turf updated successfully"));
});

//delete turf
const deleteTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }
  if (turf.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this turf");
  }
  turf.isActive = false;
  await turf.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Turf deleted successfully"));
});

//get my turf
const getMyTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({ owner: req.user._id });
  if (!turfs || turfs.length === 0) {
    throw new ApiError(404, "No turfs found for this owner");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, turfs, "My turfs retrieved successfully"));
});

//get all turf
const getAllTurfs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    location,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const query = {
    isActive: true,
  };

  if (location) {
    query.$or = [
      { location: { $regex: location, $options: "i" } },
      { city: { $regex: location, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.priceperhour = {};
    if (minPrice) query.priceperhour.$gte = Number(minPrice);
    if (maxPrice) query.priceperhour.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;

  const turfs = await Turf.find(query)
    .populate("owner", "fullName email")
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Turf.countDocuments(query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { turfs, total, page: Number(page), limit: Number(limit) },
        "Turfs retrieved successfully",
      ),
    );
});

export { createTurf, getSingleTurf, updateTurf, deleteTurf, getAllTurfs };
