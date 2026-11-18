const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter citizen name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please enter email address'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password']
  },
  ward: {
    type: String,
    default: 'Ward 1 - Patia'
  },
  greenCredits: {
    type: Number,
    default: 120
  },
  settings: {
    language: {
      type: String,
      enum: ['en', 'or'],
      default: 'en'
    },
    autoVoice: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compare password helper
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
