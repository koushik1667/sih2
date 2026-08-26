const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  localNames: { en: String, kn: String, hi: String, ta: String, te: String },
  nutrientRequirement: { N: Number, P: Number, K: Number },
  nutrientReplenishment: { N: Number, organicMatter: Number },
  suitableRegions: [String],
  season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid', 'All'] },
  waterRequirement: { type: String, enum: ['Low', 'Medium', 'High'] },
  marketDemand: Number
});

module.exports = mongoose.model('Crop', cropSchema);
