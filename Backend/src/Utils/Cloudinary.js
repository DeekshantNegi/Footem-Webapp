import {v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localfilePath, folder)=>{
    try{
       if(!localfilePath){
        return null;
       }
       const response = await cloudinary.uploader.upload(localfilePath, {
        folder,
        resource_type: 'auto'
       } )
       fs.unlinkSync(localfilePath)
       return {
        url: response.secure_url,
        public_id: response.public_id,
       };
    } catch(error){
        fs.unlinkSync(localfilePath)
        console.error("Cloudinary upload error:", error);
        return null;
    }
}

export { uploadOnCloudinary };