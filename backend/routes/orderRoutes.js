import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import { protect, restaurantOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
  try {
    let { restaurant, restaurantName, items, itemsList, amount, address, paymentMethod } = req.body;

    if (!restaurant && restaurantName) {
      const restDoc = await Restaurant.findOne({ name: restaurantName });
      if (restDoc) {
        restaurant = restDoc._id;
      }
    }

    if (!restaurant || !items || !amount || !address) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    const orderId = "#BB" + Math.floor(100000 + Math.random() * 900000);
    
    const order = new Order({
      orderId,
      customer: req.user._id,
      restaurant,
      items,
      itemsList,
      amount,
      address,
      paymentMethod,
      status: 'New',
      statusBadge: 'badge-yellow'
    });

    const createdOrder = await order.save();
    
    // Update user's total orders
    const user = await User.findById(req.user._id);
    if (user) {
      user.totalOrders += 1;
      
      // Basic logic to increment spent string (assuming "₹548" format)
      let currentSpent = parseInt(user.totalSpent.replace(/[^0-9]/g, '')) || 0;
      let newAmount = parseInt(amount.replace(/[^0-9]/g, '')) || 0;
      user.totalSpent = `₹${currentSpent + newAmount}`;
      
      await user.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private (Customer)
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image emoji')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant', 'name image emoji');
    
    if (order) {
      // Check if user is customer or restaurant owner/admin
      if (order.customer.toString() !== req.user._id.toString() && req.user.role === 'customer') {
        return res.status(401).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/restaurant/:id
// @desc    Get orders for a specific restaurant
// @access  Private (Restaurant Owner / Admin)
router.get('/restaurant/:id', protect, restaurantOwner, async (req, res) => {
  try {
    let filter = { restaurant: req.params.id };
    
    // RESTORED DEMO HACK: If demo restaurant logs in, show ALL orders from ALL restaurants
    // so they can see the popup working regardless of where the customer ordered from.
    if (req.user && req.user.email === 'restaurant@bitebolt.com') {
      filter = {};
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email initials avatarBg')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private (Restaurant Owner / Admin)
router.patch('/:id/status', protect, restaurantOwner, async (req, res) => {
  try {
    const { status, statusBadge } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status || order.status;
      order.statusBadge = statusBadge || order.statusBadge;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID (for tracking)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name location')
      .populate('customer', 'name');
      
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
