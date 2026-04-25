import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

// @desc    Fetch all foods
// @route   GET /api/foods
// @access  Public
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new food item
// @route   POST /api/foods
// @access  Public (should be Admin in real app)
router.post('/', async (req, res) => {
  const { name, price, image, category, description } = req.body;

  const food = new Food({
    name,
    price,
    image,
    category,
    description
  });

  try {
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
