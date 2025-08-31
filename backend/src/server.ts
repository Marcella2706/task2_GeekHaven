import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

import { hmacSign } from './middleware/hmac';
import { rateLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({ origin: "*", credentials: true }));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(globalLimiter);

app.use(hmacSign);

app.use('/api/auth', rateLimiter, authRoutes);
app.use('/api/users', userRoutes);


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/reselling-platform";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Assignment Seed: ${process.env.ASSIGNMENT_SEED || 'GHW25-DEFAULT'}`);
            console.log(`API Documentation: http://localhost:${PORT}/api`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

export default app;