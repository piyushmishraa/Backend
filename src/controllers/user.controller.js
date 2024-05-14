import asyncHandler from "../utils/asyncHandler.js"

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
     const{username,fullname,email}= req.body;
     console.log(username,email);
})

export {registerUser}



