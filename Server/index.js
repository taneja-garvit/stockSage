import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', queryRoutes);
app.use('/api', taskRoutes);
app.use('/api', newsRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});