import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import transporter from '../mailer.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    user = new User({ email, password: hash, verified: false });
    await user.save();
    // Create verification token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Send verification email
    const url = `${process.env.FRONTEND_URL}/verify?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify your Nexus Fright account',
      html: `<h2>Verify your account</h2><p>Click <a href="${url}">here</a> to verify your account.</p>`
    });
    res.json({ msg: 'Registration successful, please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Email verification route
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ msg: 'Invalid token' });
    if (user.verified) return res.json({ msg: 'Account already verified.' });
    user.verified = true;
    await user.save();
    res.json({ msg: 'Account verified successfully.' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.verified) return res.status(400).json({ msg: 'Please verify your email before logging in.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    // Create login token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Send sign-in notification email
    await transporter.sendMail({
      to: user.email,
      subject: 'New Sign-In to Your Nexus Fright Account',
      html: `<h2>Sign-In Alert</h2><p>Your account was just signed in. If this was not you, please reset your password immediately.</p>`
    });
    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router; 