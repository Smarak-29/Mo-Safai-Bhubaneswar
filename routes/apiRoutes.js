const express = require('express');
const router = express.Router();
const Bin = require('../models/Bin');
const User = require('../models/User');
const { requireAuth } = require('./authRoutes');

// API: Get all bins as JSON
router.get('/api/bins', async (req, res) => {
  try {
    const bins = await Bin.find().sort({ wardNumber: 1, wasteStream: 1 });
    res.json({
      success: true,
      count: bins.length,
      data: bins
    });
  } catch (err) {
    console.error('Error fetching bins:', err);
    res.status(500).json({ success: false, error: 'Server error retrieving bin telemetry' });
  }
});

// Account Page (Protected)
router.get('/account', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }

    res.render('account', {
      pageTitle: 'Citizen Account',
      activeTab: 'account',
      user,
      saved: req.query.saved === 'true',
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Error loading account:', err);
    res.redirect('/login');
  }
});

// Update Account Settings
router.post('/account/settings', requireAuth, async (req, res) => {
  try {
    const { ward, language, autoVoice } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (ward) user.ward = ward;
    if (language && ['en', 'or'].includes(language)) {
      user.settings.language = language;
    }
    user.settings.autoVoice = autoVoice === 'true' || autoVoice === true || autoVoice === 'on';

    await user.save();

    // Support both AJAX JSON response and standard POST redirect
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({
        success: true,
        message: 'Settings saved successfully',
        user: {
          name: user.name,
          email: user.email,
          ward: user.ward,
          greenCredits: user.greenCredits,
          settings: user.settings
        }
      });
    }

    res.redirect('/account?saved=true');
  } catch (err) {
    console.error('Error saving settings:', err);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
    res.redirect('/account?error=Failed+to+save+settings');
  }
});

// City Map View (Telemetry Dashboard)
router.get('/map', async (req, res) => {
  let user = null;
  if (req.session && req.session.userId) {
    user = await User.findById(req.session.userId);
  }
  const bins = await Bin.find().sort({ wardNumber: 1 });
  res.render('map', {
    pageTitle: 'City Map',
    activeTab: 'map',
    user,
    bins
  });
});

// Scanner placeholder / guidance view for mobile bottom nav
router.get('/scanner', (req, res) => {
  let user = null;
  if (req.session && req.session.userId) {
    User.findById(req.session.userId).then((u) => {
      res.render('scanner', {
        pageTitle: 'Smart Scanner',
        activeTab: 'scanner',
        user: u
      });
    });
  } else {
    res.render('scanner', {
      pageTitle: 'Smart Scanner',
      activeTab: 'scanner',
      user: null
    });
  }
});

// Root Route: redirect to /account or /login
router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/account');
  }
  res.redirect('/login');
});

module.exports = router;
