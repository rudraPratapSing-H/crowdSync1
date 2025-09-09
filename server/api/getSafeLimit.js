const express = require('express');
const router = express.Router();
const SafeLimit = require('../models/safeLimit');

// GET /api/safeLimit?eventName=...&date=...
router.get('/', async (req, res) => {
  const { eventName, date } = req.query;
  if (!eventName || !date) {
    return res.status(400).json({ error: 'eventName and date are required as query parameters.' });
  }

  try {
    const doc = await SafeLimit.findOne({ eventName, date });
    if (!doc) {
      return res.status(404).json({ error: 'No safeLimit found for this event and date.' });
    }
    // Convert array to object: { "A": num, ... }
    const result = {};
    doc.safeLimit.forEach(item => {
      result[item.zone] = item.safelimit;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
