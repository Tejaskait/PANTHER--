import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();

const upload = uploadMiddleware('uploads'); // Replace 'uploads' with your folder name

router.post('/image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = req.file.path; // URL of the uploaded file on Cloudinary
  res.status(200).json({ success: true, fileUrl });
});

export default router;
