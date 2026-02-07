import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { User } from "../Models/users.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  /* Validate input fields */
  const { fullName, email, password, role } = req.body;

  if ([fullName, email, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create({
    fullName,
    email,
    password,
    role,
    isOwnerRequested: role === "owner",
    ownerRequestDetails: role === "owner" ? ownerRequestDetails : undefined,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -__v",
  );
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        role === "owner"
          ? "Registered as owner.Admin will verify your request."
          : "User created successfully",
      ),
    );
});

//loginuser
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -__v",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully",
      ),
    );
});

//logut user

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decodedToken?._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully",
      ),
    );
});

//user profile

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken -__v",
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

//update profile

const updateProfile = asyncHandler(async (req, res) => {
  // have'nt tested this
  const { phone } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { phone },
    { new: true },
  ).select("-password -refreshToken -__v");

  return res.json(
    new ApiResponse(200, updatedUser, "Profile updated successfully"),
  );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image uploaded");
  }
  const avatarUrl = req.file?.path.replace(/\\/g, "/");
  if (!avatarUrl) {
    throw new ApiError(400, "Avatar file missing");
  }

  const uploadedImage = await uploadOnCloudinary(avatarUrl);
  if (!uploadedImage) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar: uploadedImage.url },
    { new: true },
  ).select("-password -refreshToken -__v");
  return res.json(new ApiResponse(200, user, "Avatar updated successfully"));
});

//

//change password

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "oldPassword and newPassword are required");
  }
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserProfile,
  updateProfile,
  updateUserAvatar,
  changeUserPassword,
};
