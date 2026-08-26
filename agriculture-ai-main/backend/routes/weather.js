const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  getWeather, getFarmWeather, getDashboardWeather,
} = require('../controllers/weatherController');

router.use(authMiddleware);

/**
 * GET /api/weather?lat=18.52&lng=73.85&days=7
 *   Full 7-day forecast for given coordinates.
 *   Response: { current, hourly, daily, farmAlerts, cacheSource }
 *
 * GET /api/weather/current
 *   Compact weather for the Dashboard header widget.
 *   Uses user's primary farm location.
 *
 * GET /api/weather/farm/:farmId
 *   Full forecast for a specific registered farm.
 *   Also triggers weather-alert processing for that farm.
 */
router.get('/',            getWeather);
router.get('/current',     getDashboardWeather);
router.get('/farm/:farmId', getFarmWeather);

module.exports = router;
