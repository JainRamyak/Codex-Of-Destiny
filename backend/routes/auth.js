const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({ email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT
    const payload = { user: { id: user.id } };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    
    jwt.sign(payload, secret, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ message: 'User registered', token, user: { email: user.email } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    jwt.sign(payload, secret, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ message: 'Login successful', token, user: { email: user.email } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
