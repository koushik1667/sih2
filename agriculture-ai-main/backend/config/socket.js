const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

/**
 * Initialize Socket.io on an HTTP server.
 * Called once from server.js.
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60_000,
  });

  // ── JWT authentication middleware ─────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
      || socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) return next(new Error('Authentication token required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // ── Connection handler ─────────────────────────
  io.on('connection', (socket) => {
    const uid = socket.userId;
    console.log(`🔌 Socket connected: user=${uid} socket=${socket.id}`);

    // Each user joins their private room
    socket.join(`user:${uid}`);

    // ── Chat streaming room ───────────────────────
    socket.on('chat:join', ({ sessionId }) => {
      socket.join(`chat:${sessionId}`);
    });

    socket.on('chat:leave', ({ sessionId }) => {
      socket.leave(`chat:${sessionId}`);
    });

    // ── Farm real-time updates ────────────────────
    socket.on('farm:subscribe', ({ farmId }) => {
      socket.join(`farm:${farmId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: user=${uid} socket=${socket.id}`);
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
}

/**
 * Get the Socket.io instance (safe after initSocket is called).
 */
function getIO() {
  if (!io) throw new Error('Socket.io not initialized — call initSocket first');
  return io;
}

/**
 * Emit an alert to a specific user (called from alert service).
 */
function emitAlert(userId, alert) {
  if (!io) return;
  io.to(`user:${userId}`).emit('alert:new', alert);
}

/**
 * Emit a chat stream chunk to a session room.
 */
function emitChatChunk(sessionId, chunk) {
  if (!io) return;
  io.to(`chat:${sessionId}`).emit('chat:chunk', { chunk });
}

/**
 * Signal chat stream completion.
 */
function emitChatDone(sessionId, fullResponse) {
  if (!io) return;
  io.to(`chat:${sessionId}`).emit('chat:done', { response: fullResponse });
}

/**
 * Emit a farm-level metric update (e.g. soil sensor data).
 */
function emitFarmUpdate(farmId, data) {
  if (!io) return;
  io.to(`farm:${farmId}`).emit('farm:update', data);
}

module.exports = { initSocket, getIO, emitAlert, emitChatChunk, emitChatDone, emitFarmUpdate };
