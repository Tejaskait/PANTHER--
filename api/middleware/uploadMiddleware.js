import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinaryConfig.js';
import path from 'path';

const uploadMiddleware = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const folderPath = folderName.trim();
      const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();
      const publicId = `${file.fieldname}-${Date.now()}`;

      // Determine resource type based on file extension
      const resourceType = ['mp3', 'wav', 'flac'].includes(fileExtension)
        ? 'video' // Cloudinary treats audio files as 'video'
        : 'image'; // Default to image for other file types

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
        resource_type: resourceType,
      };
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  });
};

export default uploadMiddleware;
