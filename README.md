# Paytm Clone

A simple peer-to-peer money transfer app inspired by Paytm. Users can sign up, sign in, check their wallet balance, search other users, and send money securely.

Built as a full-stack learning project with a React frontend and an Express + MongoDB backend.

## Features

- User signup and signin with JWT authentication
- Password hashing with bcrypt
- Wallet balance for every user
- Search users by name
- Instant money transfers with MongoDB transactions
- Profile updates (name / password)
- Protected routes on the frontend

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Validation | Zod |

## Project Structure

```
paytm/
├── backend/                 # Express API
│   ├── index.js             # Server entry
│   ├── db.js                # MongoDB models (User, Account)
│   ├── middleware.js        # JWT auth middleware
│   ├── routes/
│   │   ├── user.js          # Signup, signin, search, transfer, profile
│   │   └── account.js       # Balance
│   └── types.js             # Zod schemas
│
└── frontend/frontend/       # React app
    ├── src/
    │   ├── api/             # Axios client
    │   ├── context/         # Auth context (token)
    │   ├── components/      # Layout, ProtectedRoute, Logo
    │   └── pages/           # Signup, Signin, Dashboard, SendMoney, Profile
    └── vercel.json
```

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/user/signup` | No | Create account |
| POST | `/api/v1/user/signin` | No | Login |
| GET | `/api/v1/user/bulk?filter=` | Yes | Search users |
| PUT | `/api/v1/user/` | Yes | Update profile |
| POST | `/api/v1/user/transfer` | Yes | Send money |
| GET | `/api/v1/account/balance` | Yes | Get balance |

## Local Setup

### 1. Database

Run MongoDB locally (replica set required for transfers), or use MongoDB Atlas.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MONGODB_URI and JWT_SECRET
npm start
```

Server runs on `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend/frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## Environment Variables

**Backend (`.env`)**

- `PORT` — server port (default `3000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing tokens
- `FRONTEND_URL` — allowed CORS origin(s), comma-separated

**Frontend**

- `VITE_API_URL` — backend API base URL (e.g. `https://your-api.onrender.com/api/v1`)

## Deploy

Recommended setup:

1. **MongoDB Atlas** — cloud database  
2. **Render** — deploy the Express backend (`backend` folder)  
3. **Vercel** — deploy the React frontend (`frontend/frontend` folder)

On Vercel, set Root Directory to `frontend/frontend` and add `VITE_API_URL` pointing to your backend `/api/v1` URL.

## How It Works

1. User signs up → backend creates a `User` and an `Account` with balance `0`, returns a JWT  
2. Frontend stores the token and sends it as `Authorization: Bearer <token>` on protected requests  
3. User searches others and transfers money → backend runs a MongoDB transaction (debit sender, credit receiver)

## Author

Built as a full-stack practice project.
