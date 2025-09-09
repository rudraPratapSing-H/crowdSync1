const express = require('express');
const router = express.Router();
const SafeLimit = require('../models/safeLimit');

// POST /api/updateSafeLimit
router.post('/', async (req, res) => {
  const { eventName, date, safeLimit } = req.body;
  if (!eventName || !date || !Array.isArray(safeLimit)) {
    return res.status(400).json({ error: 'eventName, date, and safeLimit array are required.' });
  }

  try {
    // Upsert: update if exists, otherwise insert
    const updated = await SafeLimit.findOneAndUpdate(
      { eventName, date },
      { $set: { safeLimit } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
