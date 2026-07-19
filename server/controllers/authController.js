const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isValidCountryCode } = require('../utils/countryCodes');

// Helper to generate a 7-day JWT token
const createToken = (id, email, role, tokenVersion = 0) => {
  return jwt.sign({ id, email, role, tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const isStrongPassword = (password) =>
  typeof password === 'string' && password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

// Tourist Registration (Forced to 'user' role)
const signup = async (req, res) => {
  try {
    const { name, email, password, phoneCountryCode, phone, wechatId, country } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'This email is already registered — try logging in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      emailVerified: true,
      phoneCountryCode: phone ? phoneCountryCode : (phoneCountryCode || '+86'),
      phone: phone || '',
      wechatId: wechatId || '',
      country: country || 'China',
      role: 'user',
    });

    res.status(201).json({
      message: 'Account created successfully.',
      email: user.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'This email is already registered — try logging in.' });
    }
    console.error('signup error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Login for all roles (User, Owner, Admin) — the only login endpoint.
// Body already checked by validateLogin.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.active) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createToken(user._id, user.email, user.role, user.tokenVersion || 0);

    res.status(200).json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Verify the emailed 6-digit code (§3.7a)




// Get current profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneCountryCode: user.phoneCountryCode,
      phone: user.phone,
      wechatId: user.wechatId,
      country: user.country,
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Update current profile (email and role cannot be changed)
const updateMe = async (req, res) => {
  try {
    const { name, phoneCountryCode, phone, wechatId, country } = req.body;
    const errors = [];

    if (name !== undefined && (name.trim().length < 2 || name.trim().length > 20)) {
      errors.push({ field: 'name', message: 'Name must be between 2 and 20 characters' });
    }
    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        errors.push({ field: 'phone', message: 'Phone number must be exactly 10 digits' });
      }
      if (!phoneCountryCode || !isValidCountryCode(phoneCountryCode)) {
        errors.push({ field: 'phoneCountryCode', message: 'Please select a country code' });
      }
    }
    if (wechatId && !/^[A-Za-z0-9_-]{6,20}$/.test(wechatId)) {
      errors.push({ field: 'wechatId', message: 'WeChat ID must be 6–20 characters' });
    }

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (phoneCountryCode !== undefined) user.phoneCountryCode = phoneCountryCode;
    if (wechatId !== undefined) user.wechatId = wechatId;
    if (country) user.country = country;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneCountryCode: user.phoneCountryCode,
      phone: user.phone,
      wechatId: user.wechatId,
      country: user.country,
      role: user.role,
    });
  } catch (error) {
    console.error('updateMe error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Change own password (any logged-in role).
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: 'New password must be at least 8 characters with a letter and a number' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    // Invalidate existing active tokens on password change
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Logout endpoint (invalidates current user tokens by incrementing tokenVersion)
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      await user.save();
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('logout error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
};
