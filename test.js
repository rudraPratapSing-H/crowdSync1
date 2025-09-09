// Node.js fetch test for /api/recentZoneCounts
const fetch = require("node-fetch");
const axios = require("axios");

const eventName = "Test Event";
const date = "2025-09-08";
// const url = 'http://localhost:5000/api/recentZoneCounts?eventName=Test%20Event&date=2025-09-08';
async function testFetch() {
  const logsResp = await axios.get("http://localhost:5000/api/getEventLogs", {
    params: { eventName, date },
  });
  const historicalData = logsResp.data;
  console.log("Historical Data:", historicalData);	
}
testFetch();
