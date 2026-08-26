const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  getAlerts, getAlertsSummary, markRead,
  markAllRead, deleteAlert,
} = require('../controllers/alertsController');

router.use(authMiddleware);

/**
 * GET  /api/alerts?page=1&limit=20&type=weather_warning&severity=critical&unreadOnly=true
 *   Paginated alert list with optional filters.
 *
 * GET  /api/alerts/summary
 *   Fast: unreadCount + last 5 alerts (Dashboard badge).
 *
 * PUT  /api/alerts/:id/read
 *   Mark single alert as read.
 *
 * PUT  /api/alerts/read-all
 *   Mark all unread alerts as read.
 *
 * DELETE /api/alerts/:id
 */
router.get  ('/',          getAlerts);
router.get  ('/summary',   getAlertsSummary);
router.put  ('/read-all',  markAllRead);
router.put  ('/:id/read',  markRead);
router.delete('/:id',      deleteAlert);

module.exports = router;
