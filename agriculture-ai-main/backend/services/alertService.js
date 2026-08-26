const Alert = require('../models/Alert');
const { emitAlert } = require('../config/socket');
const { cacheInvalidatePattern } = require('../config/redis');

/**
 * Central alert creation service.
 * Creates DB record, emits real-time socket event, and invalidates alert cache.
 */
async function createAlert({ userId, farmId = null, type, severity = 'info', title, message, action = null, source = 'system', metadata = {}, expiresInHours = null }) {
  const alert = await Alert.create({
    userId,
    farmId,
    type,
    severity,
    title,
    message,
    action,
    source,
    metadata,
    expiresAt: expiresInHours ? new Date(Date.now() + expiresInHours * 3600_000) : null,
  });

  // Real-time delivery via WebSocket
  try {
    emitAlert(userId.toString(), {
      _id:      alert._id,
      type:     alert.type,
      severity: alert.severity,
      title:    alert.title,
      message:  alert.message,
      action:   alert.action,
      createdAt: alert.createdAt,
    });
  } catch {
    /* socket may not be initialized in test/batch contexts */
  }

  // Invalidate user's alert cache so next GET is fresh
  await cacheInvalidatePattern(`alerts:${userId}:*`);

  return alert;
}

/**
 * Batch-create alerts (e.g. from weather cron job).
 */
async function createAlertsBatch(alertsArray) {
  const created = await Alert.insertMany(alertsArray);

  // Emit each alert in real-time
  for (const alert of created) {
    try {
      emitAlert(alert.userId.toString(), {
        _id:      alert._id,
        type:     alert.type,
        severity: alert.severity,
        title:    alert.title,
        message:  alert.message,
        action:   alert.action,
        createdAt: alert.createdAt,
      });
    } catch { /* ignore */ }
  }

  return created;
}

/**
 * Generate and persist weather-based farm alerts.
 * Called periodically by a cron job or triggered on weather fetch.
 */
async function processWeatherAlerts(userId, farmId, weatherData) {
  const { farmAlerts = [] } = weatherData;
  if (!farmAlerts.length) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Dedup: skip if a similar alert was already sent today
  const existingTypes = new Set(
    (await Alert.find({
      userId,
      source: 'weather_api',
      createdAt: { $gte: today },
    }).select('type title')).map(a => a.title)
  );

  const newAlerts = farmAlerts
    .filter(a => !existingTypes.has(a.message))
    .map(a => ({
      userId,
      farmId,
      type: 'weather_warning',
      severity: a.severity || 'warning',
      title: a.message,
      message: a.message,
      action: a.action || null,
      source: 'weather_api',
      expiresAt: new Date(Date.now() + 24 * 3600_000),
    }));

  if (newAlerts.length) await createAlertsBatch(newAlerts);
}

/**
 * Generate soil-threshold alerts when a new reading is saved.
 */
async function processSoilAlerts(userId, farmId, soilReading) {
  const alerts = [];

  const checks = [
    { field: 'N',   low: 100, label: 'Nitrogen',   unit: 'kg/ha' },
    { field: 'P',   low: 15,  label: 'Phosphorus', unit: 'kg/ha' },
    { field: 'K',   low: 80,  label: 'Potassium',  unit: 'kg/ha' },
    { field: 'pH',  low: 5.5, high: 7.8, label: 'Soil pH', unit: '' },
    { field: 'organicCarbon', low: 0.5, label: 'Organic Carbon', unit: '%' },
  ];

  for (const { field, low, high, label, unit } of checks) {
    const val = soilReading[field];
    if (val == null) continue;

    if (low != null && val < low) {
      alerts.push({
        userId, farmId,
        type: 'soil_deficiency',
        severity: val < low * 0.6 ? 'critical' : 'warning',
        title: `Low ${label} detected`,
        message: `${label} level is ${val}${unit ? ' ' + unit : ''} — below the recommended minimum of ${low}${unit ? ' ' + unit : ''}.`,
        action: `Apply ${label.toLowerCase()} supplement before the next crop cycle`,
        source: 'ml_service',
        metadata: { field, value: val, threshold: low },
      });
    }
    if (high != null && val > high) {
      alerts.push({
        userId, farmId,
        type: 'soil_deficiency',
        severity: 'warning',
        title: `High ${label} detected`,
        message: `${label} is ${val}${unit ? ' ' + unit : ''} — above optimal range. This may affect nutrient uptake.`,
        action: 'Consider soil amendment to bring pH into 6.0–7.5 range',
        source: 'ml_service',
        metadata: { field, value: val, threshold: high },
      });
    }
  }

  if (alerts.length) await createAlertsBatch(alerts);
  return alerts;
}

module.exports = { createAlert, createAlertsBatch, processWeatherAlerts, processSoilAlerts };
