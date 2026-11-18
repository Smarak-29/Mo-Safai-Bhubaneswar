const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketId: {
    type: String,
    sparse: true,
    index: true
  },
  scanId: {
    type: String,
    required: true,
    unique: true
  },
  wardName: {
    type: String,
    default: 'Ward 1 - Patia'
  },
  wasteCategory: {
    type: String,
    enum: [
      'Wet (Biodegradable)',
      'Dry (Recyclable)',
      'Hazardous / E-Waste',
      'Temple Floral Waste'
    ],
    required: true
  },
  binColor: {
    type: String,
    enum: ['Green Bin', 'Blue Bin', 'Red/Hazardous Bin', 'Temple Compost'],
    default: 'Green Bin'
  },
  isOverflowing: {
    type: Boolean,
    default: false
  },
  drainClogRisk: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Open', 'Dispatched', 'Resolved'],
    default: 'Open'
  },
  resolvedAt: {
    type: Date
  },
  aiInstructionEn: {
    type: String,
    required: true
  },
  aiInstructionOr: {
    type: String,
    required: true
  },
  confidence: {
    type: String,
    default: '95%'
  },
  imageUrl: {
    type: String
  },
  creditsEarned: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
