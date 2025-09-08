const axios = require('axios');

const url = 'http://localhost:5000/api/updateLogs';
const data = {
		eventName: 'Test Event'
};


function postUpdate() {
	axios.post(url, data, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			console.log('POST success:', response.data);
		})
		.catch(error => {
			console.error('POST failed:', error.message);
		});
}

// Run every 15 seconds
setInterval(postUpdate, 15000);
// Run immediately on start
postUpdate();
