import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY); // Debug API Key to verify it's loading

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload image to Cloudinary
const uploadImage = async (image) => {
  try {
    console.log("Uploading image to Cloudinary...");

    if (!image.startsWith('data:image')) {
      throw new Error('Invalid image format. Must be Base64.');
    }

    const result = await cloudinary.v2.uploader.upload(image, {
      overwrite: true,
      invalidate: true,
      resource_type: "auto", // This handles all types of media
    });

    console.log("Cloudinary Upload Successful:", result.secure_url);
    return result.secure_url; // Returning the image URL from Cloudinary
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error.message);  // Throwing the error to handle in backend
  }
};

export default uploadImage;
