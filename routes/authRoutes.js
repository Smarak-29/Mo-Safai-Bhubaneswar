const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Render Login Page
router.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/account');
  }
  res.render('login', {
    pageTitle: 'Sign In',
    activeTab: 'account',
    user: null,
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// Process Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render('login', {
        pageTitle: 'Sign In',
        activeTab: 'account',
        user: null,
        error: 'Please provide both email and password.',
        success: null
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.render('login', {
        pageTitle: 'Sign In',
        activeTab: 'account',
        user: null,
        error: 'No citizen account found with this email.',
        success: null
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('login', {
        pageTitle: 'Sign In',
        activeTab: 'account',
        user: null,
        error: 'Invalid password. Please check your credentials.',
        success: null
      });
    }

    // Set session
    req.session.userId = user._id;
    res.redirect('/account');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', {
      pageTitle: 'Sign In',
      activeTab: 'account',
      user: null,
      error: 'An unexpected error occurred. Please try again.',
      success: null
    });
  }
});

// Render Register Page
router.get('/register', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/account');
  }
  res.render('register', {
    pageTitle: 'Citizen Registration',
    activeTab: 'account',
    user: null,
    error: req.query.error || null
  });
});

// Process Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, ward } = req.body;
    if (!name || !email || !password) {
      return res.render('register', {
        pageTitle: 'Citizen Registration',
        activeTab: 'account',
        user: null,
        error: 'Please fill out all required fields.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.render('register', {
        pageTitle: 'Citizen Registration',
        activeTab: 'account',
        user: null,
        error: 'An account with this email already exists. Please sign in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      ward: ward || 'Ward 1 - Patia',
      greenCredits: 120, // Welcoming joining bonus
      settings: {
        language: 'en',
        autoVoice: false
      }
    });

    req.session.userId = newUser._id;
    res.redirect('/account');
  } catch (err) {
    console.error('Registration error:', err);
    res.render('register', {
      pageTitle: 'Citizen Registration',
      activeTab: 'account',
      user: null,
      error: 'Failed to create account. Please try again.'
    });
  }
});

// One-Click Demo Citizen Login (handles GET or POST)
const handleDemoLogin = async (req, res) => {
  try {
    const demoEmail = 'smarak.citizen@bhubaneswar.gov.in';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Bhubaneswar@2026', salt);
      demoUser = await User.create({
        name: 'Smarak Mohapatra',
        email: demoEmail,
        password: hashedPassword,
        ward: 'Ward 1 - Patia',
        greenCredits: 120,
        settings: {
          language: 'en',
          autoVoice: true
        }
      });
      console.log('[Auth] Created pre-seeded demo citizen Smarak Mohapatra');
    }

    req.session.userId = demoUser._id;
    res.redirect('/account');
  } catch (err) {
    console.error('Demo login error:', err);
    res.redirect('/login?error=Demo+login+failed');
  }
};

router.get('/auth/demo-login', handleDemoLogin);
router.post('/auth/demo-login', handleDemoLogin);

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = {
  router,
  requireAuth
};
