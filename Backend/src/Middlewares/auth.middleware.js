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

// authorizeRoles works as an OR across the roles passed in — e.g.
// authorizeRoles("owner", "admin") should let *either* a verified owner
// or an admin through. Each check below only ever sets `authorized = true`;
// none of them throw on their own, so one failing role never blocks
// another from being checked.
export const authorizeRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(
        403,
        "Forbidden: You don't have permission to access this resource",
      );
    }

    let authorized = false;

    if (roles.includes("owner")) {
      const owner = await Owner.findOne({ user: req.user._id });
      if (owner && owner.status === "verified") {
        req.owner = owner;
        authorized = true;
      }
    }

    if (!authorized && roles.includes("admin") && req.user.role === "admin") {
      authorized = true;
    }

    if (!authorized) {
      throw new ApiError(
        403,
        "Forbidden: You don't have permission to access this resource",
      );
    }

    next();
  });
};