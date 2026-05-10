require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { getAllPrices } = require('./utils/marketData');

// Route imports
const authRoutes = require('./routes/authRoutes');
const marketRoutes = require('./routes/marketRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Allow multiple origins: local dev + Vercel production
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://growmore-two.vercel.app',
].filter(Boolean);

// ─── Socket.io Setup ────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Broadcast live market prices every 3 seconds
setInterval(() => {
  const prices = getAllPrices();
  io.emit('market:prices', prices);
}, 3000);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  // Send initial prices on connect
  socket.emit('market:prices', getAllPrices());

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

// Root route — Render's platform health checker pings GET /
// Without this it returns 404 and Render marks the service as unhealthy
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Grow More API is running 🚀' });
});

// API health check (used by the frontend SocketContext wake-up loop)
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Grow More API is running 🚀', timestamp: new Date() });
});

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Grow More Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}\n`);
});
