import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async(req,res)=>{
      //get user details
      //validate fields
      //check if userexist from username or email
      //check for avatar
      //check for userprofile pic
      //upload them to cloudinary but first to local disc storage via multer and delete it from there
      //create user object and create entry in db
      //remove password and refresh token from response
      //check if response is created or not 
      //send response to user 
     const{username,fullname,email,password}= req.body;
     console.log(username,email);

     if(fullname===""){
      throw new ApiError(400,"fullname is required")
     }
     if (email==="") {
      throw new ApiError(400,"email is required")
      
     }
     if (username==="") {
      throw new ApiError(400,"username is required")      
     }
     
     const existedUser= await User.findOne(
      {
            $or:[{username,email}]  //ye tarika hai to find for both username and email

      }
     )
     if(existedUser){
      throw new ApiError(409,"user with same username or email already exist")
     };

     const avatarLocalPath=req.files?.avatar[0].path ;
     const coverImageLocalPath= req.files?.coverImage[0].path ;

     if(!avatarLocalPath){
      throw new ApiError(400,"avatar is required");
     };

   const avatar= await uploadOnCloudinary(avatarLocalPath);
   const coverImage=  await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
      throw new ApiError(400,"No avatar found");
   }
    const user= await User.create({
      fullname,
      username:username.toLowerCase(),
      email,
      password,
      avatar:avatar.url,
      coverImage:coverImage?.url||""
     });
     // for removing password 
     const createdUser= await User.findById(user._id).select(
      " -password -refreshToken"
     )
      
     if(!createdUser){
      throw ApiError(500,"Something went wrong during registering")
     }

     return res.status(200).json(
      new ApiResponse(200,createdUser,"User registered succesfully")
     
     );

})

export {registerUser}



