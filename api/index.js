import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import uploadRouter from './routes/upload.route.js';
import songRouter from './routes/song.route.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true, // Allow cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/user', userRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/songs', songRouter);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to database', err);
  });

// Start the server
app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
