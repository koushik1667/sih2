const mongoose = require('mongoose');

/**
 * ChatSession: one conversation thread per user.
 * Stores summary context so RAG can inject farm-aware memory.
 */
const chatSessionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', default: null },
  title:     { type: String, default: 'New Conversation' },
  // Rolling LLM-generated summary of the session (for token-efficient memory)
  summary:   { type: String, default: '' },
  // Track which topics were discussed for context injection
  topics:    [{ type: String }],   // e.g. ['soil', 'wheat', 'irrigation']
  messageCount: { type: Number, default: 0 },
  lastMessageAt: { type: Date, default: Date.now },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

// Compound index for fast lookup: user's sessions sorted by last message
chatSessionSchema.index({ userId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
