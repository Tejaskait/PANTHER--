import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http'; // Import for creating HTTP server
import { Server } from 'socket.io'; // Import for Socket.IO
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import uploadRouter from './routes/upload.route.js';
import songRouter from './routes/song.route.js';

dotenv.config();

const app = express();
const httpServer = createServer(app); // Create an HTTP server for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Frontend origin
    credentials: true, // Allow cookies
  },
  pingInterval: 2000, // Ping interval in milliseconds
  pingTimeout: 5000, // Ping timeout in milliseconds
});

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

const players= {
   
} 
// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  players[socket.id] = {
    x: Math.random() * 500,
    y: Math.random() * 500,
    radius: 10,
    color: `hsl(${360 * Math.random()},100%,50%)`,
  }; 

io.emit('updatePlayers', players);
  // Handle custom events
socket.on('disconnect', (reason) =>{
  console.log(reason);
  delete players[socket.id];
  io.emit('updatePlayers', players);
})
  console.log(players);

});

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
httpServer.listen(3000, () => {
  console.log('Listening on port 3000!');
});
