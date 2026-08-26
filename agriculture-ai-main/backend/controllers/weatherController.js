const Farm = require('../models/Farm');
const { fetchWeather } = require('../services/weatherService');
const { processWeatherAlerts } = require('../services/alertService');
const { cacheGet, cacheSet } = require('../config/redis');

/**
 * GET /api/weather?lat=&lng=&days=7
 * Get weather for explicit coordinates (used by Weather page directly).
 */
exports.getWeather = async (req, res) => {
  try {
    const { lat, lng, days = 7 } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' });

    const data = await fetchWeather(parseFloat(lat), parseFloat(lng), parseInt(days));
    res.json(data);
  } catch (err) {
    console.error('Weather fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

/**
 * GET /api/weather/farm/:farmId
 * Get weather for a specific farm's coordinates.
 * Also triggers alert processing for the farm.
 */
exports.getFarmWeather = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.farmId, userId: req.userId });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const lat = farm.latitude  || 18.52;   // fallback: Pune
    const lng = farm.longitude || 73.85;

    const data = await fetchWeather(lat, lng);

    // Async: trigger weather-based alerts (non-blocking)
    if (data.cacheSource === 'api') {
      processWeatherAlerts(req.userId, farm._id, data).catch(console.error);
    }

    res.json({ ...data, farmId: farm._id, farmName: farm.farmName });
  } catch (err) {
    console.error('Farm weather error:', err.message);
    res.status(500).json({ error: 'Failed to fetch farm weather' });
  }
};

/**
 * GET /api/weather/current
 * Lightweight current-only endpoint for the Dashboard weather widget.
 * Uses the user's primary farm location.
 */
exports.getDashboardWeather = async (req, res) => {
  try {
    const cacheKey = `weather:dashboard:${req.userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const farm = await Farm.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    const lat = farm?.latitude  || 18.52;
    const lng = farm?.longitude || 73.85;

    const data = await fetchWeather(lat, lng, 3);

    const compact = {
      current:    data.current,
      daily:      data.daily.slice(0, 3),
      farmAlerts: data.farmAlerts,
      location:   { lat, lng, district: farm ? null : 'Default' },
    };

    await cacheSet(cacheKey, compact, 15 * 60);   // 15-min cache for dashboard
    res.json(compact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard weather' });
  }
};
