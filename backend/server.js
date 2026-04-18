const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codex')
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log('MongoDB Connection Error:', err));
console.log('Using in-memory mock database');

// Middleware
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/codex', require('./routes/codex'));
app.use('/api/chest', require('./routes/chest'));

// Catch-all route to serve the 404 page for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
