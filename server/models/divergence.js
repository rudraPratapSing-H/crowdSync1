const mongoose = require('mongoose');

const DivergenceSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  divergence: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Divergence', DivergenceSchema);