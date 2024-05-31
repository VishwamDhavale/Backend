import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.envCLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const respone = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        //file uploaded successfully
        console.log(respone.url, "File uploaded successfully on cloudinary")

        return respone;

    } catch (error) {
        fs.unlinkSync(localFilePath);// delete the file from local storage server (uploads failed)
        return null;
    }
}

export { uploadOnCloudinary };