import express from 'express';
import Restaurant from '../models/Restaurant.js';
import { protect, restaurantOwner } from '../middleware/authMiddleware.js';

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

// @desc    Get my restaurant (for owner)
// @route   GET /api/restaurants/mine
// @access  Private (Restaurant Owner)
router.get('/mine', protect, restaurantOwner, async (req, res) => {
  try {
    // Attempt to find restaurant by name (simplest link for now)
    const restaurant = await Restaurant.findOne({ name: req.user.name });
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
