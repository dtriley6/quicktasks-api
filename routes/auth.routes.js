const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, passwordHash: password });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error();

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

module.exports = router;
