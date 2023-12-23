const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Users.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password 
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userType: user.userType,
        courseId: user.courseId,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiry time
    );

    // Return the token and user data
    res.status(200).json({
      token,
      userDetails: {
        userId: user._id,
        userType: user.userType,
        courseId: user.courseId,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
