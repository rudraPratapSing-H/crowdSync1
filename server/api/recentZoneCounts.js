const express = require('express');
const router = express.Router();
const EventLog = require('../models/logs.js');

// GET /api/recentZoneCounts?eventName=...&date=...
router.get('/', async (req, res) => {
  try {
    const { eventName, date } = req.query;
    if (!eventName || !date) {
      return res.status(400).json({ error: 'Missing eventName or date in query params' });
    }
    const eventLog = await EventLog.findOne({ eventName, date });
    if (!eventLog || !eventLog.logs.length) {
      return res.status(404).json({ error: 'No logs found for this event and date' });
    }
    // Get the most recent log (last in the array)
    const recentLog = eventLog.logs[eventLog.logs.length - 1];
    res.status(200).json(recentLog.zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
