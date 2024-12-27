import Spotify from '../models/spotify.model.js';

export const uploadSong = async (req, res, next) => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Save song details in the database
    const newSong = new Spotify({
      title,
      artist,
      album,
      genre,
      duration,
      audioUrl: req.file.path, // Cloudinary URL for the uploaded file
      uploadedBy: req.user._id, // Admin ID
    });

    await newSong.save();

    res.status(201).json({ success: true, message: 'Song uploaded successfully.', song: newSong });
  } catch (error) {
    next(error);
  }
};


export const getSongs = async (req, res, next) => {
  try {
    const songs = await Spotify.find().populate('uploadedBy', 'username'); // Optionally populate uploadedBy with the username
    res.status(200).json({ success: true, songs });
  } catch (error) {
    next(error);
  }
};