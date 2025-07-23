import express from 'express';
import Location from '../models/Location.js';
const router = express.Router();

// POST /api/update-location
router.post('/update-location', async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    if (!userId || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    // Upsert: update if exists, else create
    const location = await Location.findOneAndUpdate(
      { userId },
      { latitude, longitude, timestamp: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, location });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/get-location/:userId
router.get('/get-location/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const location = await Location.findOne({ userId });
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 