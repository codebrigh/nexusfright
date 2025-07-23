const express = require('express');
const router = express.Router();

// GET /api/tracking/:number
router.get('/:number', async (req, res) => {
    const trackingNumber = req.params.number;
    try {
        // Fake data logic (same as frontend fallback)
        const statuses = [
            'In Transit', 'Out for Delivery', 'Delivered', 'Processing', 'Package Picked Up'
        ];
        const locations = [
            'Distribution Center - New York', 'Sorting Facility - Los Angeles',
            'Transit Hub - Chicago', 'Local Facility - Miami',
            'International Gateway - Houston', 'Regional Center - Atlanta',
            'Processing Center - Dallas', 'Delivery Station - Phoenix'
        ];
        const updates = [
            'Package has been picked up from sender', 'Package arrived at sorting facility',
            'Package is in transit to destination', 'Package arrived at local facility',
            'Package is out for delivery', 'Package delivered successfully',
            'Package is being processed', 'Package cleared customs'
        ];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        const now = new Date();
        const deliveryDate = new Date(now.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
        const lastUpdateDate = new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000);

        res.json({
            tracking_number: trackingNumber,
            status: randomStatus,
            last_update: `${randomUpdate} - ${randomLocation}`,
            estimated_delivery: deliveryDate.toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            }),
            last_update_time: lastUpdateDate.toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            })
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 