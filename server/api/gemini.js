const express = require("express");
require("dotenv").config();
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { eventName, date } = req.body;
  if (!eventName || !date) {
    return res.status(400).json({ error: "eventName and date are required." });
  }

  try {
    const logsResp = await axios.get("http://localhost:5000/api/getEventLogs", {
      params: { eventName, date },
    });
    const historicalData = logsResp.data;
    const timestamps = Object.keys(historicalData).sort();
    const lastTimestamp = timestamps[timestamps.length - 1];

    // --- IMPROVEMENT 1: Robust Time Calculation ---
    // Use the Date object to correctly handle hour rollovers
    const lastDate = new Date(`2025-01-01T${lastTimestamp}:00`);
    const nextDate1 = new Date(lastDate.getTime() + 60000); // Add 1 minute
    const nextDate2 = new Date(lastDate.getTime() + 120000); // Add 2 minutes

    const formatTime = (date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    const nextTs1 = formatTime(nextDate1);
    const nextTs2 = formatTime(nextDate2);
    
    // --- IMPROVEMENT 2: Dynamic Prompt Formatting ---
    const forecastPrompt = `Here is the historical crowd log data as JSON:\n${JSON.stringify(
      historicalData
    )}\n\nPredict the crowd counts for all zones for the next 2 minutes. Respond ONLY with a valid JSON object in this format:\n{"${nextTs1}": {"A": number, ...}, "${nextTs2}": {"A": number, ...}}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(forecastPrompt);

    const response = result.response;
    const responseText = response.text();
    const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    const prediction = JSON.parse(jsonString);
    res.json(prediction);

  } catch (err) {
    // --- IMPROVEMENT 3: Safer Error Handling ---
    console.error("Error in Gemini prediction route:", err); // Log the full error for debugging
    res.status(500).json({ error: "An internal server error occurred while making the prediction." });
  }
});

module.exports = router;