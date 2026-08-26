const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  createSession, getSessions, getSessionMessages,
  sendMessage, deleteSession, submitFeedback,
} = require('../controllers/chatController');

router.use(authMiddleware);

/**
 * Chat Session Management
 * ──────────────────────────────────────────────────
 * POST   /api/chat/sessions           → create new session
 * GET    /api/chat/sessions           → list user's sessions
 * GET    /api/chat/sessions/:id       → get session + messages
 * DELETE /api/chat/sessions/:id       → delete session + all messages
 */
router.post  ('/sessions',        createSession);
router.get   ('/sessions',        getSessions);
router.get   ('/sessions/:sessionId', getSessionMessages);
router.delete('/sessions/:sessionId', deleteSession);

/**
 * Messaging
 * ──────────────────────────────────────────────────
 * POST /api/chat/message             → send message, get AI response
 *   Body: { sessionId?, message, language?, streaming? }
 *
 * POST /api/chat/messages/:id/feedback → rate an AI response
 *   Body: { rating: 1-5, helpful: bool }
 */
router.post('/message',                    sendMessage);
router.post('/messages/:messageId/feedback', submitFeedback);

module.exports = router;
