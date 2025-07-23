const express = require('express');
const pool = require('../db');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Get package by tracking number
router.get('/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM packages WHERE tracking_number = ?',
      [trackingNumber]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new package
router.post('/', async (req, res) => {
  const { tracking_number, user_id, status, last_update, estimated_delivery } = req.body;
  try {
    await pool.query(
      'INSERT INTO packages (tracking_number, user_id, status, last_update, estimated_delivery) VALUES (?, ?, ?, ?, ?)',
      [tracking_number, user_id, status, last_update, estimated_delivery]
    );
    // Log the addition
    const logEntry = `[${new Date().toISOString()}] Package ${tracking_number} added: user_id=${user_id}, status=${status}, last_update=${last_update}, estimated_delivery=${estimated_delivery}\n`;
    fs.appendFile(
      path.join(__dirname, '../logs/package_updates.log'),
      logEntry,
      (err) => { if (err) console.error('Failed to log package addition:', err); }
    );
    res.json({ msg: 'Package added' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update package status
router.put('/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;
  const { status, last_update, estimated_delivery } = req.body;
  try {
    await pool.query(
      'UPDATE packages SET status = ?, last_update = ?, estimated_delivery = ? WHERE tracking_number = ?',
      [status, last_update, estimated_delivery, trackingNumber]
    );
    // Log the update
    const logEntry = `[${new Date().toISOString()}] Package ${trackingNumber} updated: status=${status}, last_update=${last_update}, estimated_delivery=${estimated_delivery}\n`;
    fs.appendFile(
      path.join(__dirname, '../logs/package_updates.log'),
      logEntry,
      (err) => { if (err) console.error('Failed to log package update:', err); }
    );
    res.json({ msg: 'Package updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 