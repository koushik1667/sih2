const SoilReading  = require('../models/SoilReading');
const Farm         = require('../models/Farm');
const { processSoilAlerts } = require('../services/alertService');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');
const axios        = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

/**
 * POST /api/soil/readings/:farmId
 * Save a new soil reading and trigger AI analysis + alerts.
 *
 * Request body: { N, P, K, pH, organicCarbon, moisture, zinc?, sulfur?, testSource? }
 */
exports.addSoilReading = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.farmId, userId: req.userId });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const reading = await SoilReading.create({
      farmId:  farm._id,
      userId:  req.userId,
      ...req.body,
    });

    // Async: get ML health score (non-blocking)
    axios.post(`${ML_SERVICE_URL}/soil/score`, {
      N: reading.N, P: reading.P, K: reading.K,
      pH: reading.pH, organicCarbon: reading.organicCarbon,
    }).then(({ data }) => {
      SoilReading.findByIdAndUpdate(reading._id, {
        healthScore:     data.healthScore,
        riskLevel:       data.riskLevel,
        recommendations: data.recommendations || [],
      }).exec();

      // Update farm's denormalized currentSoilHealth
      Farm.findByIdAndUpdate(farm._id, {
        $set: { currentSoilHealth: {
          N: reading.N, P: reading.P, K: reading.K,
          pH: reading.pH, organicCarbon: reading.organicCarbon,
          testDate: reading.readingDate,
        }},
      }).exec();
    }).catch(console.error);

    // Async: process soil-based alerts
    processSoilAlerts(req.userId, farm._id, reading).catch(console.error);

    // Invalidate caches
    await cacheDel([
      `soil:health:${farm._id}`,
      `dashboard:${req.userId}`,
    ]);

    res.status(201).json({ reading });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/soil/health/:farmId
 * Full soil health panel for the Soil Health page.
 */
exports.getSoilHealth = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.farmId, userId: req.userId });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const cacheKey = `soil:health:${farm._id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const latest = await SoilReading.findOne({ farmId: farm._id }).sort({ readingDate: -1 });
    const history = await SoilReading.find({ farmId: farm._id })
      .sort({ readingDate: -1 })
      .limit(10)
      .select('N P K pH organicCarbon moisture healthScore readingDate');

    let mlAnalysis = null;
    if (latest) {
      try {
        const { data } = await axios.post(
          `${ML_SERVICE_URL}/predict/nutrient-depletion`,
          { currentSoilHealth: latest, croppingHistory: farm.croppingHistory || [] },
          { timeout: 8000 }
        );
        mlAnalysis = data;
      } catch { /* ML service optional */ }
    }

    const result = { farm: { _id: farm._id, landSize: farm.landSize }, latest, history, mlAnalysis };
    await cacheSet(cacheKey, result, 5 * 60);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/soil/history/:farmId
 * Time-series soil data for trend charts.
 */
exports.getSoilHistory = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { months = 12 } = req.query;

    const farm = await Farm.findOne({ _id: farmId, userId: req.userId });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const since = new Date();
    since.setMonth(since.getMonth() - parseInt(months));

    const history = await SoilReading.find({
      farmId,
      readingDate: { $gte: since },
    })
      .sort({ readingDate: 1 })
      .select('N P K pH organicCarbon moisture healthScore readingDate testSource');

    res.json({ history, count: history.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
