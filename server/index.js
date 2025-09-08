require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const updateLogs = require('./api/updateLogs');
;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

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


app.get('/', (req, res) => {
  res.send('API Server Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
