const mongoose = require('mongoose');

const TrackingSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  lastUpdate: { type: String, required: true },
  estimatedDelivery: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('Tracking', TrackingSchema); 