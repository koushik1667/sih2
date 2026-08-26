const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');

// Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get crops by region
router.get('/region/:region', async (req, res) => {
  try {
    const crops = await Crop.find({ suitableRegions: req.params.region });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
