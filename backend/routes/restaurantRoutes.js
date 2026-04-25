import express from 'express';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// @desc    Fetch all restaurants
// @route   GET /api/restaurants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
