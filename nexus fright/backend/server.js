const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const trackingRoutes = require('./routes/tracking');
const locationRoutes = require('./routes/location');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/location', locationRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
}); 