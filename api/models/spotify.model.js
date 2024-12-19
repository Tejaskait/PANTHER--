import mongoose from 'mongoose';

const spotifySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: false,
    },
    genre: {
      type: String,
      required: false,
    },
    duration: {
      type: Number, // Duration in seconds
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://img.icons8.com/ios/50/000000/music.png",
      required: false,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User schema
      required: false,
      validate: {
        validator: async function (userId) {
          // Check if the user is an admin
          const User = mongoose.model('User');
          const user = await User.findById(userId);
          return user?.isAdmin;
        },
        message: 'Only admins can upload songs.',
      },
    },
  },
  { timestamps: true }
);

const Spotify = mongoose.model('Spotify', spotifySchema);
export default Spotify;
