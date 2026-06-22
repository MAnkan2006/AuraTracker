# AuraTracker

AuraTracker is a modern attendance, routine, and productivity management platform designed for students and professionals. It combines attendance tracking, weekly routine planning, task management, and profile customization into a single responsive dashboard with a premium glassmorphic UI.

## Features

### Authentication & Security

- User Registration and Login
- JWT-based Authentication
- Password Hashing using bcryptjs
- Protected API Routes
- Persistent Login Sessions

### Attendance Management

- Subject-wise Attendance Tracking
- Attendance Statistics Dashboard
- Attendance Percentage Calculation
- Calendar-based Attendance Visualization
- Attendance Streak Tracking
- Present, Absent, Late, and Excused Status Support

### Weekly Routine Planner

- Daily and Weekly Schedule Views
- Add, Edit, and Delete Routine Entries
- Time-based Activity Management
- Organized Weekly Timeline Layout

### Task Management

- Create and Manage Tasks
- Category-based Organization
- Priority/Urgency Tracking
- Task Completion Monitoring
- Progress Indicators

### User Profile

- Avatar Customization
- Attendance Goal Setting
- Profile Management
- Personalized Dashboard Experience

### User Experience

- Multiple Premium Themes
- Light and Dark Mode Support
- Responsive Design
- Interactive Dashboard Components
- Modern Glassmorphism UI

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Chart.js
- Lucide Icons

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JSON Web Tokens (JWT)
- bcryptjs

---

## Project Structure

```text
AuraTracker/
│
├── FrontEnd/
│   ├── index.html
│   ├── app.html
│   ├── landing.css
│   ├── style.css
│   ├── landing.js
│   └── app.js
│
├── backend/
│   ├── attendanceserver.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/MAnkan2006/AuraTacker.git
cd AuraTacker
```

### Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
node attendanceserver.js
```

Server will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open:

```text
FrontEnd/index.html
```

or

```text
FrontEnd/app.html
```

in your browser.

For production deployment, update the API URL in:

```javascript
const API_URL = "http://localhost:5000";
```

to your deployed backend URL.

---

## API Endpoints

### Authentication

#### Register

```http
POST /register
```

#### Login

```http
POST /login
```

### User Profile

#### Get Profile

```http
GET /profile
```

#### Update Profile

```http
POST /profile
```

---

## Deployment

### Backend

- Render

### Frontend

- Netlify

### Database

- MongoDB Atlas

---

## Future Enhancements

- Cloud Data Synchronization
- Attendance Prediction System
- Email Notifications
- Mobile Application
- Export Attendance Reports
- AI-powered Productivity Insights
- Multi-user Collaboration Features

---

## Author

**Ankan Mandal**

B.Tech, Computer Science & Engineering
National Institute of Technology (NIT) Durgapur

GitHub: https://github.com/MAnkan2006

---

## Note

This project is currently maintained as a personal and educational project. No license has been specified for this repository.
