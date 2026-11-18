const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  wardName: {
    type: String
  },
  wasteCategory: {
    type: String
  },
  aiInstructionEn: {
    type: String
  },
  aiInstructionOr: {
    type: String
  },
  isOverflowing: {
    type: Boolean,
    default: false
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
