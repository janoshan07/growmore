const express = require('express');
const router  = express.Router();
const {
  sendOtp, verifyOtpAndRegister,
  googleAuth, googleVerifyOtp,
  login, getMe, updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Email/password OTP registration
router.post('/send-otp',          sendOtp);
router.post('/verify-otp',        verifyOtpAndRegister);

// Google OAuth (two-step: token verify → OTP → create account)
router.post('/google',            googleAuth);
router.post('/google/verify-otp', googleVerifyOtp);

// Standard auth
router.post('/login',             login);
router.get('/me',                 protect, getMe);
router.put('/profile',            protect, updateProfile);

module.exports = router;
