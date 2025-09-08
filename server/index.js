require('dotenv').config();
const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const updateLogs = require('./api/updateLogs');

const updateZoneCoordinate = require('./api/updateZoneCoordinate');

const recentZoneCounts = require('./api/recentZoneCounts');
const zoneCoordinates = require('./api/zoneCoordinates');


const app = express();
const PORT = process.env.PORT || 5000;

//middlewar 
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// API routes

app.use('/api/updateLogs', updateLogs);
app.use('/api/updateZoneCoordinate', updateZoneCoordinate);

app.use('/api/recentZoneCounts', recentZoneCounts);
app.use('/api/zoneCoordinates', zoneCoordinates);


app.get('/', (req, res) => {
  res.send('API Server Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
