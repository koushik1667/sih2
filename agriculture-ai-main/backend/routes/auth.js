const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, district, state, village, language } = req.body;
    
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, phone, password: hashedPassword, district, state, village, language
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: { id: user._id, name: user.name, phone: user.phone, language: user.language }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, phone: user.phone, language: user.language }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
