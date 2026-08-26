require('dotenv').config();
const http     = require('http');
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app        = express();
const httpServer = http.createServer(app);

// ── Core middleware ────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request logging (compact) ──────────────────────
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// ── MongoDB ────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agritech')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB:', err.message));

// ── Redis (non-blocking — app starts even if Redis is down) ───
require('./config/redis').getRedisClient().catch(() => {});

// ── Socket.io ──────────────────────────────────────
const { initSocket } = require('./config/socket');
initSocket(httpServer);

// ── API Routes ─────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/farms',       require('./routes/farms'));
app.use('/api/soil',        require('./routes/soil'));
app.use('/api/crops',       require('./routes/crops'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/chat',        require('./routes/chat'));
app.use('/api/weather',     require('./routes/weather'));
app.use('/api/alerts',      require('./routes/alerts'));

// ── Health check ───────────────────────────────────
app.get('/health', async (_req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status:    'ok',
    service:   'agritech-backend',
    db:        dbState,
    uptime:    Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ───────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);
});

module.exports = app;
