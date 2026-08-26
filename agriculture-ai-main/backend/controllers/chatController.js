const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const SoilReading = require('../models/SoilReading');
const Farm        = require('../models/Farm');
const { queryRAG, buildFarmContext, summarizeSession } = require('../services/ragService');
const { emitChatChunk, emitChatDone } = require('../config/socket');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

// ── Helpers ──────────────────────────────────────

async function getActiveFarmContext(userId) {
  const farm = await Farm.findOne({ userId }).sort({ createdAt: -1 });
  if (!farm) return null;
  const soilReading = await SoilReading.findOne({ farmId: farm._id }).sort({ readingDate: -1 });
  const user = { district: farm.userId?.district, state: farm.userId?.state };
  return buildFarmContext(farm, soilReading, user);
}

// ── Controllers ───────────────────────────────────

/**
 * POST /api/chat/sessions
 * Create a new chat session.
 */
exports.createSession = async (req, res) => {
  try {
    const { farmId, title } = req.body;
    const session = await ChatSession.create({
      userId: req.userId,
      farmId: farmId || null,
      title:  title || `Chat — ${new Date().toLocaleDateString('en-IN')}`,
    });
    res.status(201).json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/chat/sessions
 * List user's chat sessions (newest first).
 */
exports.getSessions = async (req, res) => {
  try {
    const cacheKey = `chat:sessions:${req.userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ sessions: cached });

    const sessions = await ChatSession.find({ userId: req.userId })
      .sort({ lastMessageAt: -1 })
      .limit(30)
      .select('title messageCount lastMessageAt topics farmId createdAt');

    await cacheSet(cacheKey, sessions, 60);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/chat/sessions/:sessionId
 * Get messages for a session (paginated, newest first).
 */
exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify ownership
    const session = await ChatSession.findOne({ _id: sessionId, userId: req.userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-ragContext -farmContext');   // exclude heavy fields from list

    res.json({ session, messages: messages.reverse(), page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/chat/message
 * Core endpoint: receive user message, call RAG pipeline, store + return AI response.
 *
 * Request body:
 *   { sessionId, message, language?, streaming? }
 *
 * If streaming=true, the response is emitted via Socket.io events
 * (chat:chunk, chat:done) and this endpoint returns 202 Accepted immediately.
 */
exports.sendMessage = async (req, res) => {
  const { sessionId, message, language = 'en', streaming = false } = req.body;

  if (!message?.trim()) return res.status(400).json({ error: 'message is required' });

  try {
    // 1. Resolve session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId: req.userId });
      if (!session) return res.status(404).json({ error: 'Session not found' });
    } else {
      // Auto-create session if not provided
      session = await ChatSession.create({
        userId: req.userId,
        title:  message.slice(0, 50),
      });
    }

    // 2. Build farm context (enrich RAG with real farm state)
    const farmContext = await getActiveFarmContext(req.userId);

    // 3. Call RAG pipeline
    const { response, ragContext, tokensUsed, latencyMs, modelUsed } = await queryRAG({
      userMessage:    message,
      sessionId:      session._id.toString(),
      sessionSummary: session.summary,
      farmContext,
      language,
    });

    // 4. Persist the message turn
    const chatMsg = await ChatMessage.create({
      sessionId:   session._id,
      userId:      req.userId,
      userMessage: message,
      aiResponse:  response,
      ragContext,
      farmContext: farmContext ? {
        farmId:   farmContext.farmId,
        cropName: farmContext.currentCrop,
        soilPH:   farmContext.soil?.pH,
        soilN:    farmContext.soil?.N,
        soilP:    farmContext.soil?.P,
        soilK:    farmContext.soil?.K,
      } : undefined,
      modelUsed,
      tokensUsed,
      latencyMs,
      language,
    });

    // 5. Update session metadata
    session.messageCount  += 1;
    session.lastMessageAt  = new Date();
    session.title = session.messageCount === 1 ? message.slice(0, 60) : session.title;

    // Rolling summary every 10 messages (async, non-blocking)
    if (session.messageCount % 10 === 0) {
      const recent = await ChatMessage.find({ sessionId: session._id })
        .sort({ createdAt: -1 }).limit(20);
      summarizeSession(recent).then(summary => {
        if (summary) ChatSession.findByIdAndUpdate(session._id, { summary }).exec();
      });
    }

    await session.save();

    // 6. Invalidate sessions cache
    cacheDel(`chat:sessions:${req.userId}`);

    // 7. Emit stream events if requested (client subscribed via socket)
    if (streaming) {
      emitChatDone(session._id.toString(), response);
      return res.status(202).json({ sessionId: session._id, messageId: chatMsg._id });
    }

    // 8. Standard JSON response
    res.json({
      sessionId:  session._id,
      messageId:  chatMsg._id,
      response,
      latencyMs,
      ragSources: ragContext.map(r => r.source),
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process message. Please try again.' });
  }
};

/**
 * DELETE /api/chat/sessions/:sessionId
 */
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await ChatSession.deleteOne({ _id: sessionId, userId: req.userId });
    await ChatMessage.deleteMany({ sessionId });
    cacheDel(`chat:sessions:${req.userId}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/chat/messages/:messageId/feedback
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, helpful } = req.body;
    const msg = await ChatMessage.findOneAndUpdate(
      { _id: req.params.messageId, userId: req.userId },
      { $set: { 'feedback.rating': rating, 'feedback.helpful': helpful } },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
