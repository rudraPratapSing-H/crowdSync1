const mongoose = require('mongoose');

const SafeLimitSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  safeLimit: [
    {
      zone: {
        type: String,
        required: true
      },
      safelimit: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('SafeLimit', SafeLimitSchema);
