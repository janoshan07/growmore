const crypto = require('crypto');
const https  = require('https');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const { sendOtpEmail } = require('../utils/emailService');

// Works on ALL Node versions (no native fetch required)
const httpsGet = (url, headers = {}) => new Promise((resolve, reject) => {
  const opts = { headers };
  https.get(url, opts, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve(body); } });
  }).on('error', reject);
});

const makeOtp = () => String(Math.floor(100000 + Math.random() * 900000));

/* ══════════════════════════════════════════════════════════════════════════
   STEP 1 — Send OTP (email/password registration)
   POST /api/auth/send-otp
   ══════════════════════════════════════════════════════════════════════════ */
const sendOtp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const otp = makeOtp();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, name, password: hashed });
    await sendOtpEmail(email, otp, name);

    res.status(200).json({ success: true, message: 'OTP sent to your email. Expires in 10 minutes.' });
  } catch (error) { next(error); }
};

/* ══════════════════════════════════════════════════════════════════════════
   STEP 2 — Verify OTP & Complete Registration (email/password)
   POST /api/auth/verify-otp
   ══════════════════════════════════════════════════════════════════════════ */
const verifyOtpAndRegister = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const record = await Otp.findOne({ email });
    if (!record)
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Request a new one.' });
    if (record.otp !== String(otp).trim())
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });

    const existing = await User.findOne({ email });
    if (existing) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = new User({ name: record.name, email, password: record.password });
    user.$skipPasswordHash = true;
    await user.save();
    await Portfolio.create({ user: user._id, holdings: [] });
    await Otp.deleteMany({ email });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true, message: 'Account created successfully', token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, balance: user.balance, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (error) { next(error); }
};

/* ══════════════════════════════════════════════════════════════════════════
   GOOGLE OAUTH — Step 1: Verify Google token, send OTP
   POST /api/auth/google
   Accepts:
     { accessToken }  — new flow: OAuth2 implicit grant (always shows account picker)
     { credential }   — old flow: GSI ID token (kept for backwards compat)
   ══════════════════════════════════════════════════════════════════════════ */
const googleAuth = async (req, res, next) => {
  try {
    const { credential, accessToken } = req.body;
    if (!credential && !accessToken)
      return res.status(400).json({ success: false, message: 'Google credential or access token is required' });

    let googleId, email, name, picture;

    if (accessToken) {
      /* ── New flow: verify access token via Google's tokeninfo endpoint ── */
      const tokenInfo = await httpsGet(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
      );

      if (tokenInfo.error) {
        return res.status(401).json({ success: false, message: 'Google access token is invalid or expired' });
      }
      // Ensure the token was issued for OUR app, not someone else's
      if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
        return res.status(401).json({ success: false, message: 'Google token audience mismatch' });
      }

      // Fetch full user profile (name, picture)
      const userInfo = await httpsGet(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { Authorization: `Bearer ${accessToken}` }
      );

      googleId = userInfo.sub;
      email    = userInfo.email;
      name     = userInfo.name;
      picture  = userInfo.picture;

    } else {
      /* ── Old flow: verify Google ID token (JWT credential) ── */
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      ({ sub: googleId, email, name, picture } = payload);
    }

    // If user already has an account → log them in directly
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.googleId) {
        existingUser.googleId = googleId;
        existingUser.avatar = existingUser.avatar || picture;
        await existingUser.save();
      }
      const token = generateToken(existingUser._id);
      return res.status(200).json({
        success: true,
        status: 'logged_in',
        message: 'Login successful',
        token,
        user: { _id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role, balance: existingUser.balance, avatar: existingUser.avatar, createdAt: existingUser.createdAt },
      });
    }

    // New user → send OTP to their Gmail for extra verification
    const otp = makeOtp();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, name, isGoogleUser: true, googleId, avatar: picture || '' });
    await sendOtpEmail(email, otp, name);

    res.status(200).json({
      success: true,
      status: 'otp_required',
      message: 'Verification code sent to your Gmail. Please verify to complete sign-up.',
      email,
      name,
    });
  } catch (error) { next(error); }
};

/* ══════════════════════════════════════════════════════════════════════════
   GOOGLE OAUTH — Step 2: Verify OTP, create Google account
   POST /api/auth/google/verify-otp
   ══════════════════════════════════════════════════════════════════════════ */
const googleVerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const record = await Otp.findOne({ email, isGoogleUser: true });
    if (!record)
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Try signing in with Google again.' });
    if (record.otp !== String(otp).trim())
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });

    // Check again for race condition
    const existing = await User.findOne({ email });
    if (existing) {
      await Otp.deleteMany({ email });
      const token = generateToken(existing._id);
      return res.status(200).json({ success: true, token, user: { _id: existing._id, name: existing.name, email: existing.email, role: existing.role, balance: existing.balance, avatar: existing.avatar, createdAt: existing.createdAt } });
    }

    // Create Google user with a random secure password (they won't use it)
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      name: record.name,
      email,
      password: randomPassword,
      googleId: record.googleId,
      avatar: record.avatar,
    });
    await Portfolio.create({ user: user._id, holdings: [] });
    await Otp.deleteMany({ email });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Google account verified! Welcome to Grow More Lanka.',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, balance: user.balance, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (error) { next(error); }
};

/* ══════════════════════════════════════════════════════════════════════════
   LOGIN
   POST /api/auth/login
   ══════════════════════════════════════════════════════════════════════════ */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Generate and send OTP for 2FA
    const otp = makeOtp();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, name: user.name, isGoogleUser: false });
    await sendOtpEmail(email, otp, user.name);

    res.status(200).json({
      success: true,
      status: 'otp_required',
      message: 'Verification code sent to your email. Please verify to log in.',
      email: user.email,
    });
  } catch (error) { next(error); }
};

/* ══════════════════════════════════════════════════════════════════════════
   VERIFY LOGIN OTP
   POST /api/auth/login/verify-otp
   ══════════════════════════════════════════════════════════════════════════ */
const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const record = await Otp.findOne({ email });
    if (!record)
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please log in again.' });
    if (record.otp !== String(otp).trim())
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    await Otp.deleteMany({ email });

    const token = generateToken(user._id);
    res.status(200).json({
      success: true, message: 'Login successful', token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, balance: user.balance, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (error) { next(error); }
};

/* ══════════════════════════════════════════════════════════════════════════
   GET ME / UPDATE PROFILE
   ══════════════════════════════════════════════════════════════════════════ */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Profile updated', user });
  } catch (error) { next(error); }
};

module.exports = { sendOtp, verifyOtpAndRegister, googleAuth, googleVerifyOtp, login, verifyLoginOtp, getMe, updateProfile };
