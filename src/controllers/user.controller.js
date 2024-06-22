import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessTokenAndRefreshToken=async(userID)=>{
      try {
         const user= await User.findById(userID);
        
         const accessToken=  user.generateAccessToken();
         const refreshToken= user.generateRefreshToken();
        
         // refresh token save karare hain

         //yhn par fill karae and

         user.refreshToken=refreshToken;
         //yhn par save kiya


         await user.save({ validateBeforeSave:false })
         

         return {refreshToken,accessToken};
         

      } catch (error) {
            throw new ApiError(401,"Something went wrong during generating tokens")
      }

}
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

      //for getting the fileds from body using re.body
     const{username,fullname,email,password}= req.body;
     console.log(username,email);
      
     //validating if normal fields are present  or not
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


const loginUser= asyncHandler(async(req,res)=>{
      //get user data from body
      //username based or email based
      //find the user
      //password check
      //access and refresh token
      // send cookies

      const{username,email,password}=req.body;
       
      if(!(username||email)){
            throw new ApiError(404,"please enter email or password");
      }

      const user= await User.findOne({
            $or:[{email},{username}]
      });

      if(!user){
            throw new ApiError(404,"no user found")
      }
       
        //yahan par user likha hai na ki User because ye method hamne banaya hai na ki mongodb ke mongoose hai 
       const isValidPassword= await user.isPasswordCorrect(password);

       if(!isValidPassword){
            throw new ApiError(404,"Invalid user credentials");
       };

       

      const {refreshToken,accessToken}= await generateAccessTokenAndRefreshToken(user._id);
      console.log(refreshToken);
      //ab iss point pr database ke andar refresh token saved hai par vo hame nahi dena ar na password dena 
      const loggedInUser= await User.findById(user._id).select(
            " -password -refreshtoken " 
      )
      
      const options={
            httpOnly:true,
            secure:true
      }
      return res.status(200).cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
            new ApiResponse(
                  200,
                  {
                        user:loggedInUser,accessToken,refreshToken
                  },
                  "user logged in successfully"
            )
      )
      

})

const logotOutUser=asyncHandler(async(req,res)=>{
      User.findByIdAndUpdate(
            req.user._id,
            {
                  $set:{
                        refreshToken:undefined
                  }
            },
            {
                  new:true
            }

      )

      const options={
            httpOnly:true,
            secure:true
      }
      
      res.status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(
            new ApiResponse("200",{},"User logged OUT")
      )
});


//hamlog ye refreshAccessToken isliye banare qki  jab user ka access token expire hojaega
//to usko hamlog ek naya access token dedenge but verify karwake denge ...mtlb usse refreshtoken mangenge from cookies ..
//usko compare karaenge apne database jo token hai usse. agar same hota hai to dedenge ..wrna nhi
const refreshAcessToken= asyncHandler(async(req,res)=>{

      const incomingrefreshtoken=req.cookies.refreshToken;
      if (!incomingrefreshtoken) {
            throw new   ApiError(401,"token  not found")
      }
      const decodedRefreshToken=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET);

      if(!decodedRefreshToken){
            throw new ApiError(401,"token not found");

      }
       
      const user=User.findById(decodedRefreshToken._id) ;
         
      if(!user){
            throw new ApiError(401,"refresh token  not found");
      }
        
      if(incomingrefreshtoken !== user.refreshToken){
            throw new ApiError(401,"WRONG TOKEN")
      }
        
      const {accessToken,newrefreshToken}=generateAccessTokenAndRefreshToken(user._id);

      const options={
            httpOnly:true,
            secure:true
      }

      res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newrefreshToken,options)
      .json(
            new ApiResponse(200,
                  {refreshToken:newrefreshToken,accessToken},
                  "token given successfully"
            )
      )

    


})
export {registerUser,loginUser,logotOutUser,refreshAcessToken}



