const mongoose = require('mongoose');

const zoneLogSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g. '16:00', '16:05', etc.
  zones: {
    A: { type: Number, default: 0 },
    B: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
    D: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    F: { type: Number, default: 0 },
  }
}, { _id: false });

const eventLogSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  logs: [zoneLogSchema] // Array of logs for each time interval
});

module.exports = mongoose.models.EventLog || mongoose.model('EventLog', eventLogSchema);
