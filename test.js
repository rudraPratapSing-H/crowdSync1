// Node.js fetch test for /api/recentZoneCounts
const fetch = require('node-fetch');

// const url = 'http://localhost:5000/api/recentZoneCounts?eventName=Test%20Event&date=2025-09-08';
const url = "http://localhost:5000/api/zoneCoordinates"
fetch(url)
	.then(res => res.json())
	.then(data => {
		if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
			console.log('Valid JSON object:', data);
		} else {
			console.log('Not a JSON object:', data);
		}
	})
	.catch(err => {
		console.error('Fetch error:', err);
	});
