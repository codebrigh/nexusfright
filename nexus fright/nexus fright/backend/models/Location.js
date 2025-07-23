import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Location', LocationSchema); 