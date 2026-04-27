import ApiError from "../Utils/ApiError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/users.model.js";
import { Owner } from "../Models/owners.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken",
  );
  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  req.user = user;
  next();
});

export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          403,
          "Forbidden: You don't have permission to access this resource",
        );
      }
      let authorization = false;
      if (roles.includes("owner")) {
        const owner = await Owner.findOne({ user: req.user._id });
        if (!owner || owner.status !== "verified") {
          throw new ApiError(403, "Owner not approved");
        }
        req.owner = owner;
        authorization = true;
      }

      if (roles.includes("admin") && req.user.role === "admin") {
        authorization = true;
      }
      if (!authorization)
        throw new ApiError(
          403,
          "Forbidden: You don't have permission to access this resource",
        );
      next();
    } catch (error) {
      next(error);
      console.error("Authorization error:", error);
    }
  };
};
