const mongoose = require('mongoose');

/**
 * ChatMessage: individual turn in a conversation.
 * Stores both user query and AI response together for efficient retrieval.
 */
const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // The user's query
  userMessage: { type: String, required: true },

  // The AI response
  aiResponse: { type: String, required: true },

  // RAG metadata — which knowledge chunks were retrieved
  ragContext: [{
    source:    String,   // e.g. 'agri_knowledge_base', 'soil_guide'
    chunkId:   String,
    score:     Number,   // cosine similarity score
    snippet:   String,   // short excerpt used
  }],

  // Farm context snapshot at message time (for reproducibility)
  farmContext: {
    farmId:    mongoose.Schema.Types.ObjectId,
    cropName:  String,
    soilPH:    Number,
    soilN:     Number,
    soilP:     Number,
    soilK:     Number,
    season:    String,
  },

  // AI model metadata
  modelUsed:  { type: String, default: 'gpt-3.5-turbo' },
  tokensUsed: { type: Number, default: 0 },
  latencyMs:  { type: Number, default: 0 },

  // Voice support
  audioUrl:   { type: String, default: null },
  language:   { type: String, default: 'en' },

  // Feedback from farmer
  feedback: {
    rating:   { type: Number, min: 1, max: 5, default: null },
    helpful:  { type: Boolean, default: null },
  },
}, { timestamps: true });

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
