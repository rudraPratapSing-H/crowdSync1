const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');
const EventLog = require('../models/logs.js');

// Build service account object from split .env fields
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

router.post('/', async (req, res) => {
  try {
    const dbRef = admin.database().ref('/crowd');
    const snapshot = await dbRef.once('value');
    const crowdData = snapshot.val();

    // Get current time in HH:mm format
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

    const eventName = req.body.eventName || 'Default Event';

    let eventLog = await EventLog.findOne({ eventName, date: dateStr });
    if (!eventLog) {
      eventLog = new EventLog({ eventName, date: dateStr, logs: [] });
    }

    eventLog.logs.push({
      time: timeStr,
      zones: {
        A: crowdData.A || 0,
        B: crowdData.B || 0,
        C: crowdData.C || 0,
        D: crowdData.D || 0,
        E: crowdData.E || 0,
        F: crowdData.F || 0,
        G: crowdData.G || 0,
        H: crowdData.H || 0,
        I: crowdData.I || 0,
        J: crowdData.J || 0,
        K: crowdData.K || 0,
        L: crowdData.L || 0,
        M: crowdData.M || 0,
      },
    });
    await eventLog.save();

    res.status(200).json({ success: true, log: eventLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
