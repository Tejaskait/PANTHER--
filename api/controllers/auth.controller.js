import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({
      message: 'Api  route is working!',
    }); 
  };

  export const signup = async (req, res) => {
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
      res.status(500).json(error.message);
    }
  };