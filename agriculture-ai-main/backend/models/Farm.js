const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  landSize: { type: Number, required: true },
  irrigationType: { type: String, enum: ['rainfed', 'canal', 'drip', 'sprinkler'], required: true },
  latitude: Number,
  longitude: Number,
  croppingHistory: [{
    season: String,
    crop: String,
    yield: Number,
    fertilizerUsed: { N: Number, P: Number, K: Number }
  }],
  currentSoilHealth: {
    N: Number, P: Number, K: Number, pH: Number, organicCarbon: Number,
    testDate: Date, soilHealthCardId: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Farm', farmSchema);
