# 📈 Grow More — MERN Trading Platform

A full-stack trading simulation platform built with MongoDB, Express.js, React, and Node.js. Users start with **$10,000 virtual balance** and can buy/sell stocks & crypto with real-time price updates via WebSockets.

---

## 🏗️ Project Structure

```
Grow More/
├── server/          # Node.js + Express + MongoDB API
│   ├── config/      # DB connection
│   ├── controllers/ # Route logic
│   ├── middleware/  # JWT auth, error handling
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── utils/       # Market data, seeder, token gen
│   └── server.js    # Entry point
│
└── client/          # React + Vite + TailwindCSS
    └── src/
        ├── api/       # Axios instance
        ├── components/ # Navbar, Ticker, Cards, Modal
        ├── context/   # Auth + Socket contexts
        └── pages/     # Landing, Login, Register, Dashboard, Market, Portfolio, Admin
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone & Setup Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in your values:
```
MONGO_URI=mongodb://localhost:27017/growmore
JWT_SECRET=your_secret_here
```

Start the server:
```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

### 2. Seed Sample Data (Optional)
```bash
npm run seed
```
This creates test accounts:
| Email | Password | Role |
|---|---|---|
| `admin@growmore.com` | `Admin@1234` | Admin |
| `demo@growmore.com` | `Demo@1234` | User |
| `john@test.com` | `Test@1234` | User |

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**
Backend API runs on: **http://localhost:5000**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/market` | ❌ | All asset prices |
| GET | `/api/market/:symbol` | ❌ | Single asset price |
| GET | `/api/market/:symbol/history` | ❌ | 30-day chart data |
| GET | `/api/portfolio` | ✅ | Holdings + P&L |
| POST | `/api/portfolio/buy` | ✅ | Buy asset |
| POST | `/api/portfolio/sell` | ✅ | Sell asset |
| GET | `/api/portfolio/transactions` | ✅ | Trade history |
| GET | `/api/admin/stats` | 🔐 | Platform stats |
| GET | `/api/admin/users` | 🔐 | All users |

---

## ✨ Features

- **JWT Authentication** — Secure login/register with bcrypt hashing
- **Real-time Prices** — Socket.io WebSocket broadcasting every 3 seconds
- **Buy/Sell Simulation** — Full trade execution with balance deduction
- **Portfolio Tracking** — Live P&L, average buy price, allocation pie chart
- **Transaction History** — Complete buy/sell log with profit/loss
- **Market Charts** — 30-day historical line charts per asset
- **Admin Panel** — User management + platform statistics
- **Dark Mode** — Premium dark UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS |
| State | React Query (TanStack) |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP | Axios |
| Real-time | Socket.io-client |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io |
| Security | Helmet, express-rate-limit, CORS |
