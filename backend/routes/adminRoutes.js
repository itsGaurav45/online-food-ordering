import express from 'express';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const pendingRestaurants = await Restaurant.countDocuments({ status: 'pending' });
    const totalOrders = await Order.countDocuments({});
    
    // Simple revenue calculation (mock for now)
    const revenue = "₹48.6L"; 

    res.json({
      totalUsers,
      pendingRestaurants,
      totalOrders,
      revenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all restaurants for management
// @route   GET /api/admin/restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update restaurant status
// @route   PATCH /api/admin/restaurants/:id/status
router.patch('/restaurants/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (restaurant) {
      restaurant.status = status;
      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'name email initials avatarBg')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
