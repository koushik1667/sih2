const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Create farm
router.post('/', async (req, res) => {
  try {
    const farm = new Farm({ ...req.body, userId: req.user.userId });
    await farm.save();
    res.status(201).json(farm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all farms for user
router.get('/', async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user.userId });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single farm
router.get('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });
    res.json(farm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update farm
router.put('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!farm) return res.status(404).json({ error: 'Farm not found' });
    res.json(farm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete farm
router.delete('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
