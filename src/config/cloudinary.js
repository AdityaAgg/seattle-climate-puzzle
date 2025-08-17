// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dx3qkqdkp',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'maple_leaves_upload',
  apiUrl: 'https://api.cloudinary.com/v1_1'
};

// Environment check
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development'; 