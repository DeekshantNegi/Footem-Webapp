import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { User } from "../Models/users.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import { Turf } from "../Models/turfs.model.js";

//create turf
const createTurf = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

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

//update turf

const updateTurf = asyncHandler(async (req, res) => {});

//delete turf
const deleteTurf = asyncHandler(async (req, res) => {});

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

  const query = {};

  if (location) {
    query.location = { $regex: location, $options: "i" };
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
