import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';


export const test = (req, res) => {
    res.json({
      message: 'Api  route is working!',
    }); 
  };

  

  export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };


  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only delete your own account!'));
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('User has been deleted!');
    } catch (error) {
      next(error);
    }
  };


  export const getAllUsers = async (req, res, next) => {
    try {
      const adminUser = req.user; // User info from the middleware
      if (!adminUser.isAdmin) {
        return next(errorHandler(403, 'Access denied'));
      }
  
  
      const users = await User.find({}, '-password'); // Fetch all users excluding passwords
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error); // Log the error
      next(error);
    }
  };
  
  export const deleteAUser = async (req, res, next) => {
    try {
      const adminUser = req.user;
      if (!adminUser.isAdmin) {
        return next(errorHandler(403, 'Access denied'));
      }
  
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return next(errorHandler(404, 'User not found'));
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      next(error);
    }
  };
  