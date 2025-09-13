# Crowd Management System

A full-stack solution for real-time crowd monitoring, analytics, and event safety. This project includes a React dashboard frontend, a Node.js/Express backend, and MongoDB Atlas for persistent data storage.

---

## 🎬 Demo Video
[Watch the demo on Google Drive](https://drive.google.com/drive/folders/1CpuSH3ARzO7YxDgj9sGSa0s3UJev6z7K)

---

## 📦 Project Structure
```
CrowdManagement/
  crowd-dashboard/   # React frontend (see its README for UI details)
  server/            # Node.js/Express backend API
  main.py            # (Optional) Data simulation or batch scripts
  ...
```

---

## ⚙️ How It Works
- **Sensors** (real or simulated) send zone-wise crowd data to the backend.
- **Backend API** stores logs, safe limits, and event layouts in MongoDB Atlas.
- **Frontend dashboard** fetches live data, visualizes crowd density, and provides alerts and analytics for event organizers.
- **Authentication** is handled via JWT for both users and volunteers.

---

## 🖥️ Backend (server/)
- Built with Node.js, Express, and Mongoose
- RESTful API endpoints for:
  - Zone logs and statistics
  - Event layouts and zone coordinates
  - Safe limits (per zone, per event)
  - User and volunteer authentication (JWT)
  - Prediction/alerting (optional, e.g. via Gemini API)
- Environment variables in `.env` (see below)

### Key Endpoints
- `POST /api/signup`, `POST /api/login` — User registration/login
- `POST /api/volunteer/signup`, `POST /api/volunteer/login` — Volunteer registration/login
- `POST /api/updateLogs` — Log new crowd data
- `GET /api/recentZoneCounts` — Get latest headcounts per zone
- `GET /api/getSafeLimit` — Get safe limits for each zone
- `POST /api/updateSafeLimit` — Set/update safe limits
- `GET /api/eventLayout` — Get event layout and zone coordinates

---

## 🗄️ Database (MongoDB Atlas)
- Stores users, volunteers, logs, safe limits, and event layouts
- Models: `User`, `Volunteer`, `SafeLimit`, `EventLayout`, `Log`
- Connection string and credentials are managed via `.env`:
  ```
  MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
  JWT_SECRET=your_jwt_secret
  ```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd CrowdManagement
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Set up environment variables
Create a `.env` file in the `server/` directory with your MongoDB URI and JWT secret.

### 4. Start the backend server
```bash
npm start
```

### 5. Start the frontend dashboard
```bash
cd ../crowd-dashboard
npm install
npm start
```

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
MIT
