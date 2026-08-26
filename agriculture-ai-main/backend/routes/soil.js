const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  addSoilReading, getSoilHealth, getSoilHistory,
} = require('../controllers/soilController');

router.use(authMiddleware);

/**
 * POST /api/soil/readings/:farmId
 *   Log a new soil test result.
 *   Body: { N, P, K, pH, organicCarbon?, moisture?, zinc?, sulfur?, testSource? }
 *   Triggers: AI health scoring + soil-deficiency alerts
 *
 * GET  /api/soil/health/:farmId
 *   Full soil health panel (latest reading + ML analysis + recommendations).
 *   Powers the Soil Health page.
 *
 * GET  /api/soil/history/:farmId?months=12
 *   Time-series soil data for trend charts.
 */
router.post('/readings/:farmId', addSoilReading);
router.get ('/health/:farmId',   getSoilHealth);
router.get ('/history/:farmId',  getSoilHistory);

module.exports = router;
