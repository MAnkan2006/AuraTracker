# AuraTracker

AuraTracker is an advanced attendance, routine, and productivity management platform meticulously engineered for students and professionals. By integrating robust attendance tracking, dynamic weekly routine planning, intelligent task management, and comprehensive profile customization, AuraTracker delivers a unified, responsive dashboard encapsulated in a premium glassmorphic user interface.

## Core Capabilities

### 🔐 Authentication & Security Architecture

AuraTracker employs a multi-layered security model to ensure user data integrity and seamless access:
- **OAuth 2.0 Integration**: Secure Single Sign-On (SSO) capabilities via Google and GitHub.
- **JWT-based Sessions**: Stateless, secure authentication utilizing JSON Web Tokens.
- **Cryptographic Hashing**: Passwords secured via `bcryptjs`.
- **Protected API Endpoints**: Comprehensive middleware filtering for secure data access.

### 📊 Advanced Attendance Management

- **Subject-Centric Tracking**: Monitor granular attendance metrics per subject.
- **Statistical Dashboard**: Real-time percentage calculations and visual analytics.
- **Calendar Visualization**: Intuitive calendar interface for historical attendance auditing.
- **Streak Monitoring**: Gamified tracking of continuous attendance.
- **Multi-State Logging**: Support for Present, Absent, Late, and Excused statuses.

### 📅 Intelligent Routine Planner

- **Dynamic Schedule Views**: Seamlessly toggle between daily and weekly perspectives.
- **CRUD Operations**: Complete control to add, modify, or remove routine entries.
- **Time-Blocked Management**: Precision time-based activity coordination.
- **Timeline Layout**: Organized, visually distinct weekly timelines.

### ✅ Comprehensive Task Management

- **Category-Driven Organization**: Segment tasks by contextual categories.
- **Priority Tracking**: Assess and manage task urgency effectively.
- **Progress Monitoring**: Real-time tracking of task completion and milestones.

### 🤖 AI-Powered Productivity Insights & Parsing

- **Groq AI Integration**: Embedded intelligent insights powered by the Groq SDK.
- **Automated Document Parsing**: Robust PDF extraction capabilities (`pdf-parse`) to seamlessly import academic schedules and materials.

### 🎨 Premium User Experience

- **Glassmorphism UI**: State-of-the-art, modern aesthetic design.
- **Theme Engine**: Multiple premium themes including comprehensive Light and Dark modes.
- **Responsive Engineering**: Fully optimized for desktop, tablet, and mobile environments.

---

## Technical Stack & Architecture

AuraTracker is built on a modern, scalable JavaScript ecosystem utilizing a clean Model-View-Controller (MVC) architectural pattern.

### Frontend Layer
- **Core**: HTML5, CSS3, Vanilla JavaScript
- **Data Visualization**: Chart.js
- **Iconography**: Lucide Icons

### Backend Layer
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: Modular MVC (Controllers, Middleware, Models, Routes, Services, Utils, Validators)

### Data Persistence
- **Database**: MongoDB Atlas
- **ODM**: Mongoose

### Authentication & Integrations
- **Auth**: JWT, bcryptjs, OAuth 2.0 (Google/GitHub)
- **AI/ML**: Groq SDK
- **Utilities**: Multer (File Handling), PDF-Parse (Document Processing)

---

## Repository Structure

```text
AuraTracker/
├── frontend/                 # Client-side application assets
│   ├── assets/images/        # Branding and iconography assets
│   ├── css/                  # Application stylesheets
│   ├── js/                   # Application logic and scripts
│   ├── index.html            # Landing page and marketing site
│   └── app.html              # Main application dashboard
│
├── backend/                  # Node.js Express server
│   ├── controllers/          # Request handlers and business logic
│   ├── middleware/           # Custom Express middleware (e.g., Auth)
│   ├── models/               # Mongoose database schemas
│   ├── routes/               # API endpoint definitions
│   ├── services/             # Third-party integrations (Groq, OAuth)
│   ├── utils/                # Helper functions and utilities
│   ├── validators/           # Request validation schemas
│   ├── server.js             # Application entry point
│   ├── package.json          # Server dependencies and scripts
│   └── .env                  # Environment configuration
│
└── README.md                 # Project documentation
```

---

## Installation & Deployment Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (Local or Atlas)
- Google Cloud Console Project (for OAuth)
- GitHub OAuth Application (for OAuth)
- Groq API Key (for AI features)

### 1. Repository Initialization

```bash
git clone https://github.com/MAnkan2006/AuraTacker.git
cd AuraTacker
```

### 2. Backend Environment Configuration

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and configure the required environment variables:

```env
# Database configuration
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_secure_jwt_secret

# AI Integration
GROQ_API_KEY=your_groq_api_key

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth 2.0 Credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend Redirection (Defaults to localhost:5500 if unset)
FRONTEND_URL=http://127.0.0.1:5500/app.html
```

### 3. Server Initialization

```bash
npm start
```
*The backend service will initialize on port 5000 (`http://localhost:5000`).*

### 4. Frontend Execution

To launch the frontend locally, utilize a local development server (such as VS Code's Live Server) to serve the `frontend` directory. Ensure it runs on the port specified in your `FRONTEND_URL`.

- Landing Page: `index.html`
- Application Dashboard: `app.html`

> **Note on Deployment**: When deploying to production environments (e.g., Render, Netlify), ensure that the `FRONTEND_URL` environment variable on the backend points to the deployed frontend domain, and the frontend API endpoints are updated to reflect the deployed backend URL.

---

## API Architecture Overview

The backend is modularized into distinct routing namespaces for separation of concerns:

- `/api/auth` - Authentication workflows (Native Login, Google/GitHub OAuth callbacks)
- `/api/profile` - User profile management and data retrieval
- `/api/onboarding` - Initial user setup and configuration
- `/api/routine` - CRUD operations for weekly scheduling
- `/api/sync` - Synchronization endpoints for seamless state management

*For detailed payload structures, refer to the respective route controllers in the backend directory.*

---

## Roadmap & Future Enhancements

- **Cloud Data Synchronization**: Enhanced multi-device real-time sync.
- **Attendance Prediction Engine**: ML-driven insights predicting future attendance requirements.
- **Automated Notifications**: Email and push notifications for critical schedule events.
- **Cross-Platform Mobile Application**: Native mobile experience.
- **Advanced Export Utilities**: Comprehensive PDF/CSV report generation.
- **Collaborative Workspaces**: Multi-user collaboration features for study groups.

---

## Maintainer

**Ankan Mandal**  
*B.Tech, Computer Science & Engineering*  
*National Institute of Technology (NIT) Durgapur*  
[GitHub Profile](https://github.com/MAnkan2006)

---

*This repository is maintained as an educational and personal showcase project. No specific license is attached at this time.*
