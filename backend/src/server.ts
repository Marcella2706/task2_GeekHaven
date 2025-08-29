import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.get('/IIT2024018/healthz', (req, res) => {
    res.json({ status: 'ok' });
});

let recentLogs: any[] = [];
app.use((req, res, next) => {
    recentLogs.unshift({
        timestamp: new Date(),
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });
    if (recentLogs.length > 50) {
        recentLogs.pop();
    }
    next();
});

app.get('/logs/recent', (req, res) => {
    res.json(recentLogs);
});


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/reselling-platform";

mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error(err));