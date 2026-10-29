
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
  })
);

app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'Student Internship Portal API is running!',
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'An unexpected server error occurred.',
  });
});

async function startServer() {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error(
        'MONGO_DB_URI is missing. Configure it in your .env file.'
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
