import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name:"dwl2hjsga", 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary= async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        const response =await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log(response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
    }
}
    


export {uploadOnCloudinary};