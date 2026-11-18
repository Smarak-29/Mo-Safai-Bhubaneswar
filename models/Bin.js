const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  wardNumber: {
    type: Number,
    required: true
  },
  wardName: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    enum: ['North', 'South-East', 'South-West'],
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  wasteStream: {
    type: String,
    enum: ['Wet', 'Dry'],
    required: true
  },
  fillLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Normal', 'Filling', 'Critical'],
    default: 'Normal'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bin', BinSchema);
