import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT=asyncHandler((req,res,next)=>{
    const token=req.cookies.accessToken;
    if(!verifyJWT){
        throw new ApiError(401,"cant access token");
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    if(!decodedToken){
        throw new ApiError(401,"not decoded");
    }
    
   const user=User.findById(decodedToken._id);
   if (!user) {
    throw new ApiError(401,"no user loggedin");

    
   }
   req.user=user;
   next();
    
})