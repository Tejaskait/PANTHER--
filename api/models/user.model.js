import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true, 
      },
      imageUrl:{
        type: String,
        default: "https://img.icons8.com/color/48/000000/user-male-circle.png",
        required: true,
      }
    }, 
    { timestamps: true }
  );
const User = mongoose.model('User', userSchema);
export default User;