require('dotenv').config({ override: true });
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeWasteImage } = require('../utils/geminiHelper');
const Report = require('../models/Report');
const User = require('../models/User');

// Ensure uploads directory exists for saving image previews
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Use Memory Storage so req.file.buffer is directly available for base64 inlineData conversion
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Helper to resolve current citizen (or default demo citizen)
const resolveUser = async (req) => {
  if (req.session && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) return user;
  }
  let demoUser = await User.findOne({ email: 'smarak.citizen@bhubaneswar.gov.in' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Smarak Mohapatra',
      email: 'smarak.citizen@bhubaneswar.gov.in',
      password: 'demo_password_hash',
      ward: 'Ward 1 - Patia',
      greenCredits: 120,
      settings: { language: 'en', autoVoice: true }
    });
  }
  return demoUser;
};

// POST /api/scan - Analyze Waste Image & Generate Grievance Ticket if Overflowing
router.post('/api/scan', upload.single('wasteImage'), async (req, res) => {
  try {
    const user = await resolveUser(req);
    const sampleType = req.body.sampleType; // 'wet', 'overflowing', 'temple', 'dry'

    let imageBuffer = null;
    let mimeType = 'image/jpeg';
    let imageUrl = null;

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;

      // Save a copy to public/uploads/ for image preview & persistence
      const ext = path.extname(req.file.originalname) || '.jpg';
      const filename = `waste-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      imageUrl = `/uploads/${filename}`;
      console.log(`[Scan Route] Received uploaded image: ${req.file.originalname} (${req.file.size} bytes, saved to ${imageUrl})`);
    }

    // Call Gemini 2.5 Flash via official SDK
    const analysis = await analyzeWasteImage({
      imageBuffer,
      mimeType,
      sampleType
    });

    // Credit rules: +20 for overflowing bin report, +10 for standard scan
    const creditsEarned = analysis.isOverflowing ? 20 : 10;
    user.greenCredits = (user.greenCredits || 0) + creditsEarned;
    await user.save();

    // Grievance Ticket Generation: format BMC-SWM-2026-XXXX
    let ticketId = null;
    if (analysis.isOverflowing) {
      const randDigits = Math.floor(1000 + Math.random() * 9000);
      ticketId = `BMC-SWM-2026-${randDigits}`;
    }

    const scanId = `SCAN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Persist Report to MongoDB
    const report = await Report.create({
      userId: user._id,
      ticketId,
      scanId,
      wardName: user.ward || 'Ward 1 - Patia',
      wasteCategory: analysis.wasteCategory,
      binColor: analysis.binColor,
      isOverflowing: Boolean(analysis.isOverflowing),
      drainClogRisk: Boolean(analysis.drainClogRisk),
      aiInstructionEn: analysis.instructionEn,
      aiInstructionOr: analysis.instructionOr,
      confidence: analysis.confidence || '95%',
      imageUrl,
      creditsEarned
    });

    return res.json({
      success: true,
      data: {
        id: report._id,
        scanId,
        ticketId,
        wasteCategory: analysis.wasteCategory,
        binColor: analysis.binColor,
        isOverflowing: analysis.isOverflowing,
        drainClogRisk: analysis.drainClogRisk,
        instructionEn: analysis.instructionEn,
        instructionOr: analysis.instructionOr,
        confidence: analysis.confidence,
        creditsEarned,
        newGreenCredits: user.greenCredits,
        imageUrl,
        wardName: report.wardName,
        createdAt: report.createdAt
      }
    });
  } catch (err) {
    console.error('[API /api/scan Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message || 'Waste image analysis failed'
    });
  }
});

// GET /api/reports - Fetch recent reports for user
router.get('/api/reports', async (req, res) => {
  try {
    const user = await resolveUser(req);
    const reports = await Report.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    console.error('[API /api/reports Error]:', err.message);
    return res.status(500).json({ success: false, error: 'Could not fetch citizen reports' });
  }
});

module.exports = router;
