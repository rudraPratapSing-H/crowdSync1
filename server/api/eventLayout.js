const express = require('express');
const router = express.Router();
const EventLayout = require('../models/eventLayout');

// POST /api/eventLayout
router.post('/', async (req, res) => {
  try {
    const { eventName, walls, objects, sensors, doors } = req.body;
    if (!eventName) {
      return res.status(400).json({ error: 'eventName is required.' });
    }
    // Upsert: update if exists, otherwise insert
    const layout = await EventLayout.findOneAndUpdate(
      { eventName },
      { $set: { walls: walls || [], doors: doors || [], objects: objects || [], sensors: sensors || [] } },
      { new: true, upsert: true }
    );
    res.json({ success: true, layout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// GET /api/eventLayout?eventName=Event1
router.get('/', async (req, res) => {
  try {
    const { eventName } = req.query;
    if (!eventName) {
      return res.status(400).json({ error: 'eventName query parameter is required.' });
    }
    const layout = await EventLayout.findOne({ eventName });
    if (!layout) {
      return res.status(404).json({ error: 'Event layout not found.' });
    }
    // Only return the relevant fields
    res.json({
      walls: layout.walls,
      objects: layout.objects,
      sensors: layout.sensors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
