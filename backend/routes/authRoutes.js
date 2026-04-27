import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Set initials based on name
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Assign a random avatar background color
    const colors = ['var(--red)', 'var(--orange)', 'var(--teal)', 'var(--green)', '#9B5DE5'];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
      initials,
      avatarBg
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        initials: user.initials,
        avatarBg: user.avatarBg,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        initials: user.initials,
        avatarBg: user.avatarBg,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      initials: user.initials,
      avatarBg: user.avatarBg,
      status: user.status
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @route   POST /api/auth/google
// @desc    Auth user with Google token
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { token, isCustom, email: customEmail, name: customName } = req.body;
    let name, email;

    if (isCustom) {
      // Trust the info because we fetched it on frontend via valid access_token
      name = customName;
      email = customEmail;
    } else {
      const clientID = process.env.GOOGLE_CLIENT_ID;
      const client = new OAuth2Client(clientID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientID,
      });
      const payload = ticket.getPayload();
      name = payload.name;
      email = payload.email;
    }
    
    let user = await User.findOne({ email });
    if (!user) {
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const colors = ['var(--red)', 'var(--orange)', 'var(--teal)', 'var(--green)', '#9B5DE5'];
      const avatarBg = colors[Math.floor(Math.random() * colors.length)];
      
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-10) + 'A1!', // Dummy secure password
        role: 'customer',
        initials,
        avatarBg
      });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      initials: user.initials,
      avatarBg: user.avatarBg,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google auth' });
  }
});

export default router;
