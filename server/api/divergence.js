
const express = require('express');
const router = express.Router();
const Divergence = require('../models/divergence');

// GET: View current divergence status and movements for an event
router.get('/:eventName', async (req, res) => {
  try {
    const divergence = await Divergence.findOne({ eventName: req.params.eventName });
    if (!divergence) {
      return res.status(404).json({ message: 'Divergence status not found' });
    }
    res.json({
      divergence: divergence.divergence,
      movements: divergence.movements || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Toggle divergence status for an event
router.post('/:eventName/toggle', async (req, res) => {
  try {
    let divergence = await Divergence.findOne({ eventName: req.params.eventName });
    if (!divergence) {
      divergence = new Divergence({ eventName: req.params.eventName, divergence: true });
    } else {
      divergence.divergence = !divergence.divergence;
    }
    await divergence.save();
    res.json({ divergence: divergence.divergence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a movement string to the movements array for an event
router.post('/:eventName/movement', async (req, res) => {
  const { movement } = req.body;
  if (!movement) {
    return res.status(400).json({ error: 'Movement string is required.' });
  }
  try {
    let divergence = await Divergence.findOne({ eventName: req.params.eventName });
    if (!divergence) {
      divergence = new Divergence({ eventName: req.params.eventName, movements: [movement] });
    } else {
      divergence.movements.push(movement);
    }
    await divergence.save();
    res.json({ success: true, movements: divergence.movements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;