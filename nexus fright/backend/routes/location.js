const express = require('express');
const pool = require('../db');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Update user's live location
router.post('/update-location', async (req, res) => {
  const { userId, latitude, longitude } = req.body;
  if (!userId || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    // Upsert: update if exists, else insert
    const [rows] = await pool.query('SELECT id FROM locations WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      await pool.query(
        'UPDATE locations SET latitude = ?, longitude = ?, updated_at = NOW() WHERE user_id = ?',
        [latitude, longitude, userId]
      );
    } else {
      await pool.query(
        'INSERT INTO locations (user_id, latitude, longitude) VALUES (?, ?, ?)',
        [userId, latitude, longitude]
      );
    }
    // Log the location update
    const logEntry = `[${new Date().toISOString()}] User ${userId} location updated: lat=${latitude}, lng=${longitude}\n`;
    fs.appendFile(
      path.join(__dirname, '../logs/location_updates.log'),
      logEntry,
      (err) => { if (err) console.error('Failed to log location update:', err); }
    );
    res.json({ msg: 'Location updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's live location
router.get('/get-location/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT latitude, longitude, updated_at FROM locations WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Location not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 