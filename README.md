# AI Study & Collaboration Hub

A simple MERN stack web application for student collaboration — manage notes, ask AI doubts, and join study groups.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI:** Google Gemini API

## Features

- JWT-based authentication (signup, login, logout)
- Dashboard with stats, joined groups, recent notes, and messages
- Notes module (create, view, delete)
- AI Assistant (ask study questions via Gemini API)
- Groups module (create up to 3 groups, join groups)

## Project Structure

```
ai-study-collaboration-hub/
├── client/          # React frontend
├── server/          # Express backend
└── README.md
```

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Setup

### 1. Install dependencies

```bash
cd ai-study-collaboration-hub

# Backend
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Gemini API key

# Frontend
cd ../client
npm install
```

### 2. Configure environment variables

Edit `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-study-hub
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or use a MongoDB Atlas connection string in `.env`.

### 4. Run the application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/notes` | Get user's notes |
| POST | `/api/notes` | Create a note |
| DELETE | `/api/notes/:id` | Delete a note |
| GET | `/api/groups` | Get joined groups |
| POST | `/api/groups` | Create a group (max 3 per user) |
| POST | `/api/groups/join/:id` | Join a group |
| POST | `/api/ai/chat` | Ask AI a question |
| GET | `/api/dashboard/stats` | Get dashboard statistics |

## Database Models

- **User:** name, email, password, aiQueriesUsed
- **Note:** userId, title, description, createdAt
- **Group:** name, subject, members, createdBy
