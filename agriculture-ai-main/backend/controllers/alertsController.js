const Alert = require('../models/Alert');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

/**
 * GET /api/alerts
 * List alerts for the authenticated user, paginated.
 */
exports.getAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, severity, unreadOnly } = req.query;
    const skip = (page - 1) * limit;

    const cacheKey = `alerts:${req.userId}:${page}:${limit}:${type||''}:${severity||''}:${unreadOnly||''}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const filter = { userId: req.userId };
    if (type)       filter.type     = type;
    if (severity)   filter.severity = severity;
    if (unreadOnly === 'true') filter.isRead = false;

    const [alerts, total, unreadCount] = await Promise.all([
      Alert.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Alert.countDocuments(filter),
      Alert.countDocuments({ userId: req.userId, isRead: false }),
    ]);

    const result = { alerts, total, unreadCount, page: Number(page), limit: Number(limit) };
    await cacheSet(cacheKey, result, 30);   // 30s cache
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/alerts/summary
 * Fast summary for the Dashboard badge (unread count + last 3 alerts).
 */
exports.getAlertsSummary = async (req, res) => {
  try {
    const cacheKey = `alerts:summary:${req.userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const [recent, unreadCount] = await Promise.all([
      Alert.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('type severity title message action createdAt isRead'),
      Alert.countDocuments({ userId: req.userId, isRead: false }),
    ]);

    const result = { recent, unreadCount };
    await cacheSet(cacheKey, result, 30);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/alerts/:id/read
 * Mark a single alert as read.
 */
exports.markRead = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    await cacheDel([`alerts:summary:${req.userId}`]);
    await cacheInvalidatePattern(`alerts:${req.userId}:*`);
    res.json({ alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/alerts/read-all
 * Mark all unread alerts as read.
 */
exports.markAllRead = async (req, res) => {
  try {
    const { modifiedCount } = await Alert.updateMany(
      { userId: req.userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    await cacheDel(`alerts:summary:${req.userId}`);
    res.json({ success: true, markedRead: modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/alerts/:id
 */
exports.deleteAlert = async (req, res) => {
  try {
    await Alert.deleteOne({ _id: req.params.id, userId: req.userId });
    await cacheDel(`alerts:summary:${req.userId}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Local import for pattern invalidation
const { cacheInvalidatePattern } = require('../config/redis');
