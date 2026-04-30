import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { User } from "../Models/users.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import { compressImage } from "../Utils/compressimage.js";
import fs from "fs";
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
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
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

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
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
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      await User.findByIdAndUpdate(decoded._id, {
        $unset: { refreshToken: 1 },
      });
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }

  const options = {
    httpOnly: true,
    secure: false,
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

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken?._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }
  const options = {
    httpOnly: true,
    secure: false,
  };
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
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
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const updates = {};
  const allowedFields = ["fullName", "email", "phone"];

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      const value = req.body[key];
      if (value !== null && value !== undefined) {
        updates[key] = value;
      }
    }
  });

  if ("fullName" in updates && !updates.fullName.trim()) {
    throw new ApiError(400, "Name cannot be empty");
  }

  if ("email" in updates && !updates.email.trim()) {
    throw new ApiError(400, "Email cannot be empty");
  }

  if ("phone" in updates) {
    if (updates.phone !== "" && !/^\d{10}$/.test(updates.phone)) {
      throw new ApiError(400, "Phone number must be 10 digits");
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update profile");
  }

  return res.json(
    new ApiResponse(200, updatedUser, "Profile updated successfully"),
  );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.path) {
    throw new ApiError(400, "No image uploaded");
  }
  const avatarUrl = req.file?.path.replace(/\\/g, "/");
  if (!avatarUrl) {
    throw new ApiError(400, "Avatar file missing");
  }

  let compressedImage;

  try {
    const compressedPath = `./public/temp/compressed-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
    compressedImage = await compressImage(avatarUrl, compressedPath);

    const uploadedImage = await uploadOnCloudinary(compressedImage, "avatars");
    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload avatar");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        avatar: {
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
        },
      },
      { new: true },
    ).select("-password -refreshToken -__v");

    return res.json(new ApiResponse(200, user, "Avatar updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to update avatar");
  } finally {
    try {
      if (avatarUrl && fs.existsSync(avatarUrl)) {
        fs.unlinkSync(avatarUrl);
      }

      if (compressedImage && fs.existsSync(compressedImage)) {
        fs.unlinkSync(compressedImage);
      }
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
  }
});

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
