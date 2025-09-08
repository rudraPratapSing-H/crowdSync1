const mongoose = require('mongoose');

const zoneCoordinateSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  coordinates: [
    {
      zone: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    }
  ]
});

const ZoneCoordinate = mongoose.models.ZoneCoordinate || mongoose.model('ZoneCoordinate', zoneCoordinateSchema);

module.exports = ZoneCoordinate;
