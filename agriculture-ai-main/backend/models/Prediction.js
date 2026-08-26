const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  predictionDate: { type: Date, default: Date.now },
  riskScore: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  nutrientDepletion: {
    N: { current: Number, projected: [Number] },
    P: { current: Number, projected: [Number] },
    K: { current: Number, projected: [Number] }
  },
  yieldDeclineProbability: Number,
  economicLoss: Number,
  recommendedRotation: [{
    season: String,
    crop: String,
    reason: String
  }],
  soilRecoveryTimeline: Number
});

module.exports = mongoose.model('Prediction', predictionSchema);
