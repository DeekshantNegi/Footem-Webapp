import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { User } from "../Models/users.models.js";

//register user
const registerUser = asyncHandler(async (req, res) => {
  /* Validate input fields */
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -__v",
  );
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

//loginuser
const loginUser = asyncHandler(async (req, res) => {});

//logut user

const logoutUser = asyncHandler(async (req, res) => {});
//user profile

const getUserProfile = asyncHandler(async (req, res) => {});

//change password

const changeUserPassword = asyncHandler(async (req, res) => {});

export { registerUser, loginUser, logoutUser, getUserProfile, changeUserPassword };