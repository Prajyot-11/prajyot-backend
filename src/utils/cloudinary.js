import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log("Cloudinary Config: ", process.env.CLOUDINARY_CLOUD_NAME);
    try {
        localFilePath = path.resolve(localFilePath);
        if(!localFilePath) 
        {
            console.log("local file path from cloudinary: ", localFilePath);
            return null;
        }
        
        // upload the file on the cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("file has been uploaded on cloudinary", response.url);
        return response;

    } catch (error) {
        console.error("Cloudinary upload error: ", error); // ✅ ADD THIS
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // ✅ Only unlink if it exists
        return null;
    }  
}

export {uploadOnCloudinary} 