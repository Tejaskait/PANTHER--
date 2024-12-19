import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import uploadRouter from './routes/upload.route.js';
import cookieParser from 'cookie-parser';
import songRouter from './routes/song.route.js';

const app = express();
dotenv.config();


app.use(express.json());
app.use(cookieParser());

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/songs', songRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to database');
}).catch(err => {
    console.error('Error connecting to database', err);
})


app.listen(3000, ()=> {
    console.log('listening on 3000!!');
}); 