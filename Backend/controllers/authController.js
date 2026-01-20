const crypto = require('crypto');
const { v4: uuid } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const { sendVerificationEmail, sendResetEmail } = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');

const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOpts = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  };
  res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) {
      return res.status(400).json({ message: 'Invalid referral code' });
    }
    referredBy = referrer._id;
  }

  const verificationToken = uuid();
  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
    verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    referredBy
  });

  // Update referrer's referral count
  if (referredBy) {
    await User.findByIdAndUpdate(referredBy, { $inc: { referralCount: 1 } });
  }

  const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  await sendVerificationEmail(user, verifyLink);

  res.status(201).json({ message: 'Registered. Please verify your email.' });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: new Date() }
  });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully' });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' });
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email' });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user, accessToken, refreshToken });
});

const refresh = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.refreshToken ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  let payload;
  try {
    payload = require('jsonwebtoken').verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const user = await User.findById(payload.id);
  if (!user || !user.refreshTokens.includes(token)) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ accessToken, refreshToken });
});

const logout = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.refreshToken ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (token) {
    const payload = require('jsonwebtoken').decode(token);
    if (payload?.id) {
      await User.updateOne(
        { _id: payload.id },
        { $pull: { refreshTokens: token } }
      );
    }
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'We will email you if the address is registered' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  try {
    await sendResetEmail(user, resetLink);
    res.status(200).json({ message: 'We will email you if the address is registered' });
  } catch (_err) {
    res.status(200).json({ message: 'We will email you if the address is registered' });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetExpires: { $gt: new Date() }
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = password;
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();
  res.json({ message: 'Password updated' });
});

const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      password: uuid(), // Random password
      isVerified: true,
      avatar: { url: picture }
    });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user, accessToken, refreshToken });
});

module.exports = {
  register,
  verifyEmail,
  login,
  googleLogin,
  refresh,
  logout,
  forgotPassword,
  resetPassword
};


