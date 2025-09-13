const mongoose = require('mongoose');
const heads = new mongoose.Schema({
  attendeeName: {
    type: String,
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

})
const EventSchema = new mongoose.Schema({
  eventname: {
    type: String,
    required: true
  },
  
  date: {
    type: Date,
    required: true
  },
  heads: [heads],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);