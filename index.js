
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow your deployed Vercel frontend
const allowedOrigins = [
  'https://intern-shala-swart.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (such as direct API checks and server-to-server requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error('Blocked CORS origin:', origin);
      return callback(new Error('Origin not allowed by CORS'));
    },
  })
);

// Parse JSON request bodies
app.use(express.json());

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Student Internship Portal API is running!',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS blocked this request.',
      origin: req.headers.origin || null,
    });
  }

  res.status(500).json({
    error: 'An unexpected server error occurred.',
  });
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error(
        'MONGO_DB_URI is missing. Configure it in your environment variables.'
      );
    }

    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('MongoDB connected successfully!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();

