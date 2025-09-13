const mongoose = require('mongoose');

const MovementSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  movements: [{ type: String }] // Array of movement strings
});

module.exports = mongoose.model('Movement', MovementSchema);