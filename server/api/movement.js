const express = require('express');
const router = express.Router();
const Movement = require('../models/movement');

// POST: Add a movement string to the array for an event
router.post('/:eventName', async (req, res) => {
  const { movement } = req.body;
  if (!movement) {
    return res.status(400).json({ error: 'Movement string is required.' });
  }
  try {
    let doc = await Movement.findOne({ eventName: req.params.eventName });
    if (!doc) {
      doc = new Movement({ eventName: req.params.eventName, movements: [movement] });
    } else {
      doc.movements.push(movement);
    }
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get the most recent 5 movement strings for an event
router.get('/:eventName/recent', async (req, res) => {
  try {
    const doc = await Movement.findOne({ eventName: req.params.eventName });
    if (!doc || !doc.movements.length) {
      return res.json({ movements: [] });
    }
    // Return the last 5 items (most recent first)
    const recentMovements = doc.movements.slice(-5).reverse();
    res.json({ movements: recentMovements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
