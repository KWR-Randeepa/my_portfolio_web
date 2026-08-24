import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server directory (works regardless of CWD)
dotenv.config({ path: path.join(__dirname, '.env') });

// Fix Windows Node.js querySrv ECONNREFUSED issues with MongoDB Atlas (Windows only)
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Ignore DNS override errors
  }
}

import contactRoutes from './routes/contactRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://my-portfolio-web-opal-iota.vercel.app',
  'https://www.ravindurandeepa.dev',
  'https://ravindurandeepa.dev',
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, same-origin on Vercel)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('ravindurandeepa')
    ) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

// MongoDB connection caching for serverless environments
let isConnected = false;
export async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return true;
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is missing.');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Fast fail in 5s if IP is blocked or connection fails
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
}

// Middleware to ensure DB is connected on every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      error: 'Database connection failed',
      details: err.message,
      tip: 'Check MONGO_URI in Vercel Environment Variables and verify MongoDB Atlas IP Whitelist (0.0.0.0/0).'
    });
  }
});

app.use('/api/contact', contactRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Healthcheck route
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'ok', dbState: mongoose.connection.readyState });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Global error handler — catches unhandled errors from async routes
// and returns JSON instead of Express's default HTML error page
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Run standalone server if executed directly (not in Vercel serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('Failed to start server due to DB error:', err);
    });
}

export default app;