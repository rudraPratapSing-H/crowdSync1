const express = require('express');
const router = express.Router();
const ZoneCoordinate = require('../models/zoneCoordinate.js');

// POST /api/updateZoneCoordinate
router.post('/', async (req, res) => {
  try {
    const { eventName, date, coordinates } = req.body;
    if (!eventName || !date || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid eventName, date, or coordinates' });
    }
    // Validate each coordinate object
    for (const z of coordinates) {
      if (!z.zone || typeof z.lat !== 'number' || typeof z.lng !== 'number') {
        return res.status(400).json({ error: 'Each coordinate must have zone, lat, and lng' });
      }
    }
    // Upsert by eventName and date
    const updated = await ZoneCoordinate.findOneAndUpdate(
      { eventName, date },
      { eventName, date, coordinates },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, doc: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
