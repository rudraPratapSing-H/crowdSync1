const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventname: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true  
  },
  date: {
    type: Date,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  attendance: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);