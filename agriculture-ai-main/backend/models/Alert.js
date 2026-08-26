const mongoose = require('mongoose');

/**
 * Alert: unified alert/notification model.
 * Sources: weather engine, ML predictions, soil thresholds, cron jobs.
 */
const alertSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', default: null },

  type: {
    type: String,
    required: true,
    enum: [
      'weather_warning',   // rain, frost, drought, heatwave
      'pest_risk',         // high pest probability
      'soil_deficiency',   // nutrient dip below threshold
      'irrigation_needed', // soil moisture low
      'crop_stage',        // phenological milestone
      'market_price',      // price spike/drop
      'ai_recommendation', // proactive AI tip
      'system',            // app-level notifications
    ],
  },

  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info',
  },

  title:   { type: String, required: true },
  message: { type: String, required: true },

  // Actionable suggestion
  action:  { type: String, default: null },

  // Source that generated this alert
  source: {
    type: String,
    enum: ['weather_api', 'ml_service', 'cron', 'system', 'manual'],
    default: 'system',
  },

  // Rich metadata (flexible for different alert types)
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Delivery state
  isRead:       { type: Boolean, default: false },
  readAt:       { type: Date, default: null },
  isDelivered:  { type: Boolean, default: false },
  deliveredAt:  { type: Date, default: null },

  // Push notification tracking
  pushSent:     { type: Boolean, default: false },
  smsSent:      { type: Boolean, default: false },

  // Expiry — old weather alerts can be auto-dismissed
  expiresAt:    { type: Date, default: null },
}, { timestamps: true });

alertSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Alert', alertSchema);
