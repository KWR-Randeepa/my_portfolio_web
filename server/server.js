import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Fix Windows Node.js querySrv ECONNREFUSED issues with MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);
import contactRoutes from './routes/contactRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Connect to MongoDB database and check connection status
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Verification comment: Log successful MongoDB connection
    console.log(' MongoDB connected successfully');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    // Verification comment: Log MongoDB connection error
    console.error(' MongoDB connection failed:', err);
  });