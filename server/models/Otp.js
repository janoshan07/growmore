const mongoose = require('mongoose');

/**
 * Stores a pending OTP for email verification.
 * Auto-deletes after 10 minutes via TTL index.
 * Supports both email/password and Google sign-ups.
 */
const otpSchema = new mongoose.Schema({
  email:        { type: String, required: true, lowercase: true, trim: true },
  otp:          { type: String, required: true },
  name:         { type: String, required: true },
  // For email/password sign-up (pre-hashed)
  password:     { type: String, default: null },
  // For Google sign-up
  isGoogleUser: { type: Boolean, default: false },
  googleId:     { type: String, default: null },
  avatar:       { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now, expires: 600 }, // TTL: 10 min
});

module.exports = mongoose.model('Otp', otpSchema);
