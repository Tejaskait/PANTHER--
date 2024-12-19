import express from 'express';
import { getSongs, uploadSong } from '../controllers/song.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// POST /api/songs/upload - Admin-only route for uploading songs
router.post(
  '/upload',
  verifyToken,
  verifyAdmin,
  uploadMiddleware('spotify/songs').single('file'), // Reuse the middleware to upload to 'spotify/songs'
  uploadSong
);

router.get('/songs', getSongs);

export default router;
