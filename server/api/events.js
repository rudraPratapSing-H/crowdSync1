const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// GET /api/events - Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id - Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events - Create new event
router.post('/', async (req, res) => {
  const { eventname, name, date, url, attendance } = req.body;

  if (!eventname || !name || !date || !url) {
    return res.status(400).json({
      error: 'eventname, name, date, and url are required.'
    });
  }

  try {
    const newEvent = new Event({
      eventname,
      name,
      date,
      url,
      attendance: attendance || false
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Event name already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// PUT /api/events/:id - Update event details (full update)
router.put('/:id', async (req, res) => {
  const { eventname, name, date, url, attendance } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...(eventname && { eventname }),
        ...(name && { name }),
        ...(date && { date }),
        ...(url && { url }),
        ...(attendance !== undefined && { attendance })
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Event name already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// PATCH /api/events/:id - Partial update of event details
router.patch('/:id', async (req, res) => {
  const allowedFields = ['eventname', 'name', 'date', 'url', 'attendance'];
  const updates = {};

  // Only include fields that are provided and allowed
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Event name already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// PATCH /api/events/:id/attendance - Update only attendance status
router.patch('/:id/attendance', async (req, res) => {
  const { attendance } = req.body;

  if (attendance === undefined || typeof attendance !== 'boolean') {
    return res.status(400).json({ error: 'attendance must be a boolean value' });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { attendance },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Attendance updated successfully',
      event: updatedEvent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event deleted successfully',
      deletedEvent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
