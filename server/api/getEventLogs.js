const express = require('express');
const router = express.Router();
const EventLog = require('../models/logs');

// GET /api/eventLogs?eventName=...&date=...
router.get('/', async (req, res) => {
  const { eventName, date } = req.query;
  if (!eventName || !date) {
    return res.status(400).json({ error: 'eventName and date are required as query parameters.' });
  }

  try {
    // Find all logs for the event and date
    const lgs = await EventLog.find({ eventName, date });
    let result = {};
    lgs.map(log => {
      log.logs.forEach(entry => {
        result[entry.time] = entry.zones;
      });   
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
