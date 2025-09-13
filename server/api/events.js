;

const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// GET /api/events/:eventId/heads/:headId - Get individual head (attendee) data
router.get('/:eventId/heads/:headId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found.'
      });
    }

    const head = event.heads.id(req.params.headId);
    if (!head) {
      return res.status(404).json({
        success: false,
        error: 'Head not found.'
      });
    }

    res.json({
      success: true,
      data: head
    });
  } catch (error) {
    console.error('Error fetching head:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
//
// POST /api/events/:eventId/heads/:headId/attendance - Update attendance boolean for a head
router.post('/:eventId/heads/:headId/attendance', async (req, res) => {
  try {
    const { attendance } = req.body;
    if (typeof attendance !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'attendance (boolean) is required.'
      });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found.'
      });
    }

    const head = event.heads.id(req.params.headId);
    if (!head) {
      return res.status(404).json({
        success: false,
        error: 'Head not found.'
      });
    }

    head.attendance = attendance;
    await event.save();

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: head
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
// POST /api/events/:id/heads - Add a new head (attendee) to an event
router.post('/:id/heads', async (req, res) => {
  try {
    const { attendeeName, url, attendance } = req.body;

    if (!attendeeName || !url) {
      return res.status(400).json({
        success: false,
        error: 'attendeeName and url are required.'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found.'
      });
    }

    const newHead = {
      attendeeName,
      url,
      attendance: attendance || false
    };
    event.heads.push(newHead);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Head added successfully',
      data: event
    });
  } catch (error) {
    console.error('Error adding head:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/events - Create new event

router.post('/', async (req, res) => {
  try {
    const { eventname, date, heads } = req.body;

    // Validation
    if (!eventname || !date || !Array.isArray(heads) || heads.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: eventname, date, and heads (array of attendees) are required.'
      });
    }

    // Validate each head
    for (const head of heads) {
      if (!head.attendeeName || !head.url) {
        return res.status(400).json({
          success: false,
          error: 'Each head must have attendeeName and url.'
        });
      }
    }

    // Create new event
    const newEvent = new Event({
      eventname,
      date: new Date(date),
      heads
    });

    // Save to database
    const savedEvent = await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    });

  } catch (error) {
    console.error('Error creating event:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Event already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/events - Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/events/:id - Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Error fetching event:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
