const Farm        = require('../models/Farm');
const SoilReading = require('../models/SoilReading');
const Alert       = require('../models/Alert');
const { fetchWeather } = require('../services/weatherService');
const { cacheGet, cacheSet } = require('../config/redis');

/**
 * GET /api/dashboard
 *
 * Single aggregated endpoint powering the Home Dashboard screen.
 * Combines: farm summary, latest soil, weather, alerts, crop stage.
 *
 * Cache: 5 minutes per user (weather refreshes independently).
 */
exports.getDashboard = async (req, res) => {
  try {
    const cacheKey = `dashboard:${req.userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    // Run all DB queries in parallel
    const [farm, unreadAlerts, recentAlerts] = await Promise.all([
      Farm.findOne({ userId: req.userId }).sort({ createdAt: -1 }),
      Alert.countDocuments({ userId: req.userId, isRead: false }),
      Alert.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('type severity title message action createdAt'),
    ]);

    // Latest soil reading (separate query to allow null farm)
    const soilReading = farm
      ? await SoilReading.findOne({ farmId: farm._id }).sort({ readingDate: -1 })
      : null;

    // Farm health score calculation
    const healthScore = computeHealthScore(soilReading, farm);

    // Weather (fast because cached in WeatherCache / Redis)
    let weather = null;
    if (farm?.latitude && farm?.longitude) {
      weather = await fetchWeather(farm.latitude, farm.longitude, 3).catch(() => null);
    }

    const dashboard = {
      user: { id: req.userId },
      farm: farm ? {
        _id:             farm._id,
        landSize:        farm.landSize,
        irrigationType:  farm.irrigationType,
        currentCrop:     farm.croppingHistory?.slice(-1)[0]?.crop || null,
        croppingHistory: farm.croppingHistory?.slice(-3) || [],
        location: {
          lat: farm.latitude,
          lng: farm.longitude,
        },
      } : null,
      soil: soilReading ? {
        N:             soilReading.N,
        P:             soilReading.P,
        K:             soilReading.K,
        pH:            soilReading.pH,
        moisture:      soilReading.moisture,
        organicCarbon: soilReading.organicCarbon,
        healthScore:   soilReading.healthScore || healthScore,
        lastTested:    soilReading.readingDate,
      } : (farm?.currentSoilHealth || null),
      healthScore,
      alerts: {
        unreadCount: unreadAlerts,
        recent:      recentAlerts,
      },
      weather: weather ? {
        current:    weather.current,
        daily:      weather.daily?.slice(0, 3),
        farmAlerts: weather.farmAlerts,
      } : null,
      generatedAt: new Date().toISOString(),
    };

    await cacheSet(cacheKey, dashboard, 5 * 60);   // 5-minute cache
    res.json(dashboard);

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

/**
 * Compute a 0-100 farm health score from soil readings.
 * Penalties for out-of-range values, bonuses for optimal.
 */
function computeHealthScore(soilReading, farm) {
  if (!soilReading && !farm?.currentSoilHealth) return null;

  const s = soilReading || farm.currentSoilHealth;
  let score = 100;

  // pH penalty
  const pH = s.pH || s.ph;
  if (pH) {
    if (pH < 5.5 || pH > 8.0)  score -= 20;
    else if (pH < 6.0 || pH > 7.5) score -= 10;
  }

  // Nitrogen penalty
  const N = s.N;
  if (N != null) {
    if (N < 100)       score -= 15;
    else if (N < 150)  score -= 7;
  }

  // Phosphorus penalty
  const P = s.P;
  if (P != null) {
    if (P < 10)        score -= 10;
    else if (P < 20)   score -= 5;
  }

  // Potassium penalty
  const K = s.K;
  if (K != null) {
    if (K < 80)        score -= 10;
    else if (K < 100)  score -= 5;
  }

  // Organic carbon penalty
  const oc = s.organicCarbon;
  if (oc != null) {
    if (oc < 0.5)      score -= 10;
    else if (oc < 0.75) score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}
