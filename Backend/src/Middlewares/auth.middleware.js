 import ApiError from '../Utils/ApiError.js';
 import asyncHandler from '../Utils/asyncHandler.js';
 import jwt from 'jsonwebtoken';
 import {User} from '../Models/users.model.js';

 export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try{
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
       if(!token){
            throw new ApiError(401, "Unauthorized request")
       }

       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

       const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
       if(!user){
            throw new ApiError(401,"Invalid Access Token");
       }

       req.user = user;
       next();
    } catch(error){
        throw new ApiError(401, error?.message || "Invalid access token");
    }
 })

 export const authorizeRoles = asyncHandler((...roles) => (req, res, next) => {
    if(!req.user){
         throw new ApiError(401, "Unauthorized request");
    }
    
    if (!roles.includes(req.user.role)) {
        throw new ApiError(403, "You are not authorized to perform this action");
    }
    next();
 });