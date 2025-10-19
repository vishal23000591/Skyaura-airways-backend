const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Admin Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin user exists
    const existingUser = await User.findOne({ email, role: 'admin' });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    // Create new admin user - role fixed as 'admin'
    const newUser = new User({ username, email, password, role: 'admin' });

    await newUser.save();

    res.status(201).json({ message: 'Admin registered successfully', user: newUser });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
