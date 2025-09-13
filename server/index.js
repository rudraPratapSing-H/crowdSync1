require('dotenv').config();
const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const updateLogs = require('./api/updateLogs');

const updateZoneCoordinate = require('./api/updateZoneCoordinate');

const recentZoneCounts = require('./api/recentZoneCounts');
const zoneCoordinates = require('./api/zoneCoordinates');
const updateSafeLimit = require('./api/updateSafeLimit');
const getSafeLimit = require('./api/getSafeLimit');
const getEventLogs = require('./api/getEventLogs');

const eventLayout = require('./api/eventLayout');
const predictiveAPI = require('./api/gemini');
// const userSignup = require('./api/userSignup');
// const userLogin = require('./api/userLogin');
// const volunteerSignup = require('./api/volunteerSignup');
// const volunteerLogin = require('./api/volunteerLogin');
const events = require('./api/events');
const divergence = require('./api/divergence');

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
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
app.use('/api/getEventLogs', getEventLogs);
app.use('/api/recentZoneCounts', recentZoneCounts);
app.use('/api/zoneCoordinates', zoneCoordinates);
app.use('/api/updateSafeLimit', updateSafeLimit);
app.use('/api/getSafeLimit', getSafeLimit);

app.use('/api/eventLayout', eventLayout);
app.use('/api/gemini', predictiveAPI);
app.use('/api/events', events);
app.use('/api/divergence', divergence);

// User auth endpoints
// app.use('/api/userSignup', userSignup);
// app.use('/api/userLogin', userLogin);

// Volunteer auth endpoints
// app.use('/api/volunteer/signup', volunteerSignup);
// app.use('/api/volunteer/login', volunteerLogin);

app.get('/', (req, res) => {
  res.send('API Server Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
