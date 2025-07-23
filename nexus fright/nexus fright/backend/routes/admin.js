const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const transporter = require('../mailer');

// Simple admin auth middleware (for demo)
const ADMIN_PASSWORD = 'admin123'; // Change this in production!

function adminAuth(req, res, next) {
  if (req.headers['x-admin-password'] === ADMIN_PASSWORD) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// Create tracking entry
router.post('/tracking', adminAuth, async (req, res) => {
  try {
    const tracking = new Tracking(req.body);
    await tracking.save();
    res.json(tracking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all tracking entries
router.get('/tracking', adminAuth, async (req, res) => {
  const trackings = await Tracking.find();
  res.json(trackings);
});

// Update tracking entry
router.put('/tracking/:id', adminAuth, async (req, res) => {
  try {
    const tracking = await Tracking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Send email notification to user
    if (tracking && tracking.email) {
      await transporter.sendMail({
        to: tracking.email,
        subject: 'Your Tracking Update from Nexus Fright',
        html: `<h2>Tracking Update</h2><p>Your tracking number <b>${tracking.trackingNumber}</b> has been updated.</p><p>Status: <b>${tracking.status}</b><br>Last Update: <b>${tracking.lastUpdate}</b><br>Estimated Delivery: <b>${tracking.estimatedDelivery}</b></p>`
      });
    }
    res.json(tracking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete tracking entry
router.delete('/tracking/:id', adminAuth, async (req, res) => {
  await Tracking.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Public (but protected) tracking lookup by tracking number
router.get('/tracking/:trackingNumber', adminAuth, async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ trackingNumber: req.params.trackingNumber });
    if (!tracking) return res.status(404).json({ error: 'Tracking number not found' });
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 