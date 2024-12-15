import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const test = (req, res) => {
    res.json({
      message: 'Api  route is working!',
    }); 
  };

  export const signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    
    // Hash the user's password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    // Determine if the user is an admin
    const isAdmin = email === 'tejaskait12@gmail.com';
  
    // Create a new user instance
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      isAdmin 
    });
  
    try {
      // Save the user to the database
      await newUser.save();
      res.status(201).json('User created successfully!');
    } catch (error) {
     next(errorHandler(550,'error creating user'));
    }
  };

  export const signin = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const validUser = await User.findOne({ email });
      if (!validUser) return next(errorHandler(404, 'User not found!'));
  
      // Check if the password matches
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
  
      // Generate a JWT token including admin status
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin }, // Include isAdmin in the token payload
        process.env.JWT_SECRET,
        
      );
  
      // Destructure the user object to exclude the password
      const { password: pass, ...rest } = validUser._doc;
  
      // Send response with the token in cookies and user data
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json({ ...rest, isAdmin: validUser.isAdmin });
    } catch (error) {
      next(error);
    }
  };