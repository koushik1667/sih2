const mongoose = require('mongoose');

/**
 * SoilReading: timestamped soil test record per farm.
 * Enables trend analysis and depletion projections over time.
 */
const soilReadingSchema = new mongoose.Schema({
  farmId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Core macronutrients (kg/ha)
  N: { type: Number, required: true },
  P: { type: Number, required: true },
  K: { type: Number, required: true },

  // Soil chemistry
  pH:            { type: Number, required: true },
  organicCarbon: { type: Number },        // %
  electricalConductivity: { type: Number }, // dS/m

  // Micronutrients (mg/kg)
  zinc:    Number,
  iron:    Number,
  copper:  Number,
  boron:   Number,
  sulfur:  Number,
  manganese: Number,

  // Physical properties
  moisture:   { type: Number },  // %
  bulkDensity: Number,           // g/cm³
  texture: {
    sand: Number,  // %
    silt: Number,
    clay: Number,
  },

  // Depth of sample (cm)
  sampleDepth: { type: String, default: '0-15' },

  // Source of test
  testSource: {
    type: String,
    enum: ['lab', 'sensor', 'soil_health_card', 'manual', 'estimated'],
    default: 'lab',
  },

  // Government Soil Health Card ID
  soilHealthCardId: String,

  // AI-generated health score (0–100)
  healthScore:  Number,
  riskLevel:    { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },

  // Derived: AI recommendations snapshot
  recommendations: [String],

  readingDate: { type: Date, default: Date.now },
}, { timestamps: true });

soilReadingSchema.index({ farmId: 1, readingDate: -1 });

module.exports = mongoose.model('SoilReading', soilReadingSchema);
