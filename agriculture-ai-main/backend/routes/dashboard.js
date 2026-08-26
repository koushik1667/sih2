const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const { getDashboard } = require('../controllers/dashboardController');

router.use(authMiddleware);

/**
 * GET /api/dashboard
 *
 * Aggregated single-request endpoint powering the Home Dashboard screen.
 *
 * Returns:
 * {
 *   farm:        { _id, landSize, irrigationType, currentCrop, location }
 *   soil:        { N, P, K, pH, moisture, healthScore, lastTested }
 *   healthScore: number (0-100)
 *   alerts:      { unreadCount, recent: Alert[] }
 *   weather:     { current, daily[0..2], farmAlerts }
 *   generatedAt: ISO timestamp
 * }
 *
 * Cache TTL: 5 minutes (Redis). Weather component has its own 30-min cache.
 */
router.get('/', getDashboard);

module.exports = router;
