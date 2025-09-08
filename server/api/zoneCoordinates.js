const express = require('express');
const router = express.Router();
const ZoneCoordinate = require('../models/zoneCoordinate');

// GET /api/zoneCoordinates
router.get('/', async (req, res) => {
  try {
    // Find all zone coordinate documents
    const docs = await ZoneCoordinate.find({});
    // Aggregate all coordinates into a flat object: { "A": { lat, lng }, ... }
    const result = {};
    docs.forEach(doc => {
      if (Array.isArray(doc.coordinates)) {
        doc.coordinates.forEach(z => {
          if (z.zone && typeof z.lat === 'number' && typeof z.lng === 'number') {
            result[z.zone] = { lat: z.lat, lng: z.lng };
          }
        });
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
