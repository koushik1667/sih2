const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Placeholder for predictions endpoints
router.post('/', async (req, res) => {
  res.json({ message: 'Prediction endpoint - to be implemented with ML service' });
});

module.exports = router;
