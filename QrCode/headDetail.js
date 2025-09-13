// Replace these with your actual eventId and headId
const eventId = 'YOUR_EVENT_ID_HERE';
const headId = 'YOUR_HEAD_ID_HERE';

async function fetchHeadDetail(eventId, headId) {
  try {
    const response = await fetch(`http://localhost:5000/api/events/${eventId}/heads/${headId}`);
    const result = await response.json();
    if (result.success) {
      displayHeadDetail(result.data);
    } else {
      displayError(result.error || 'Failed to fetch head detail');
    }
  } catch (err) {
    displayError('Network error: ' + err.message);
  }
}

function displayHeadDetail(head) {
  const container = document.getElementById('head-detail');
  if (!container) return;
  container.innerHTML = `
    <h2>Attendee Detail</h2>
    <p><strong>Name:</strong> ${head.attendeeName}</p>
    <p><strong>URL:</strong> <a href="${head.url}" target="_blank">${head.url}</a></p>
    <p><strong>Attendance:</strong> ${head.attendance ? 'Present' : 'Absent'}</p>
    <p><strong>Created At:</strong> ${new Date(head.createdAt).toLocaleString()}</p>
  `;
}

function displayError(message) {
  const container = document.getElementById('head-detail');
  if (!container) return;
  container.innerHTML = `<p style="color:red;">${message}</p>`;
}

// Call this function with actual IDs after DOM is loaded
// Example: fetchHeadDetail('eventId', 'headId');