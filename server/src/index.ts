import express from 'express';
import type { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes-project-db';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Test Route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend! ' });
});
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});