const mongoose = require("mongoose");
const { Schema } = mongoose;

// A schema for a sensor's coverage area
const SensorSchema = new Schema(
  {
    center: {
      type: [Number], // Stored as [x, y]
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
    zoneName: {
      // Optional: to link this radius to a specific zone like "A"
      type: String,
    },
  },
  { _id: false }
); // _id: false prevents creating sub-document IDs

const EventLayoutSchema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
      unique: true, // Each event should have a unique name
    },
    // Walls are stored as an array of line segments.
    // Each line segment is an array of two coordinate pairs.
    // Example: [ [[startX, startY], [endX, endY]], ... ]
    walls: {
      type: [[[Number]]],
      default: [],
    },
    doors: {
      type: [[[Number]]],
      default: [],
    },

    // Objects are stored as an array of polygons.
    // Each polygon is an array of three or more coordinate pairs (its vertices).
    // Example: [ [[x1, y1], [x2, y2], [x3, y3]], ... ]
    objects: {
      type: [[[Number]]],
      default: [],
    },

    // Using the sub-schema for a cleaner structure
    sensors: {
      type: [SensorSchema],
      default: [],
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const EventLayout = mongoose.model("EventLayout", EventLayoutSchema);

module.exports = EventLayout;
