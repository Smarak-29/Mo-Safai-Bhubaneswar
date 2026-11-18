const express = require('express');
const router = express.Router();
const Bin = require('../models/Bin');
const User = require('../models/User');
const Report = require('../models/Report');
const { requireAuth } = require('./authRoutes');
const {
  optimizeRoutes,
  simulateOverflowSpike,
  resetAllBins,
  FACILITIES
} = require('../utils/routeOptimizer');

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

// Route Optimization API (Dual-Stream Haversine Nearest-Neighbor)
router.get('/api/optimize-route', async (req, res) => {
  try {
    const zone = req.query.zone;
    const result = await optimizeRoutes(zone);
    res.json(result);
  } catch (err) {
    console.error('Error optimizing routes:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Demo Control: Simulate Overflow Spike (Boost 3-4 random bins to 85%-96%)
router.post('/api/simulate-spike', async (req, res) => {
  try {
    const result = await simulateOverflowSpike();
    res.json({
      success: true,
      message: 'Overflow spike simulated for demonstration',
      count: result.count,
      data: result.updated
    });
  } catch (err) {
    console.error('Error simulating spike:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Demo Control: Reset All Bins to healthy levels (20%-65%)
router.post('/api/reset-bins', async (req, res) => {
  try {
    const result = await resetAllBins();
    res.json({
      success: true,
      message: 'All smart bins reset to healthy operating levels',
      count: result.count,
      data: result.updated
    });
  } catch (err) {
    console.error('Error resetting bins:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Municipal Command Map View (Leaflet.js + Dual-Stream Route Optimizer)
router.get('/map', async (req, res) => {
  try {
    let user = null;
    if (req.session && req.session.userId) {
      user = await User.findById(req.session.userId);
    }
    const bins = await Bin.find().sort({ wardNumber: 1 });
    // Fetch recent BMC 1929 grievance tickets from Stage 2
    const tickets = await Report.find({ isOverflowing: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.render('map', {
      pageTitle: 'Municipal Command Map',
      activeTab: 'map',
      user,
      bins,
      tickets,
      facilities: FACILITIES
    });
  } catch (err) {
    console.error('Error loading map view:', err);
    res.render('map', {
      pageTitle: 'Municipal Command Map',
      activeTab: 'map',
      user: null,
      bins: [],
      tickets: [],
      facilities: FACILITIES
    });
  }
});

// Smart Waste Scanner View
router.get('/scanner', async (req, res) => {
  try {
    let user = null;
    let reports = [];

    if (req.session && req.session.userId) {
      user = await User.findById(req.session.userId);
      if (user) {
        reports = await Report.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .limit(8);
      }
    } else {
      // Find or seed demo user so scanner history shows clean BMC civic tickets
      const demoUser = await User.findOne({ email: 'smarak.citizen@bhubaneswar.gov.in' });
      if (demoUser) {
        user = demoUser;
        reports = await Report.find({ userId: demoUser._id })
          .sort({ createdAt: -1 })
          .limit(8);
      }
    }

    res.render('scanner', {
      pageTitle: 'Smart Scanner',
      activeTab: 'scanner',
      user,
      reports
    });
  } catch (err) {
    console.error('Error loading scanner view:', err);
    res.render('scanner', {
      pageTitle: 'Smart Scanner',
      activeTab: 'scanner',
      user: null,
      reports: []
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
