import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,  //from cloudinary url
        required:true,
        
    },
    coverImage:{
        type:String, //from cloudinary url
        required:true
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        },
        
    ],
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

//it is a middleware "pre one",we want before "save"run this function also dont sue arrow function cause it doesnt have this object
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
     this.username=bcrypt.hash(this.password,10);
 next();

})

userSchema.methods.isPasswordCorrect= async function(password){
  return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
};
userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id,
     
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
};
export const User=mongoose.model("User",userSchema);
