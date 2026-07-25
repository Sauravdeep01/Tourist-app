const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Gallery = require('../models/Gallery');

const isStrongPassword = (password) =>
  typeof password === 'string' && password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

// List all Owners with their tour count (Admin only)
const listOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' })
      .select('name email active createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const tourCounts = await Tour.aggregate([{ $group: { _id: '$ownerId', count: { $sum: 1 } } }]);
    const countByOwner = new Map(tourCounts.map((t) => [String(t._id), t.count]));

    const result = owners.map((owner) => ({
      ...owner,
      tourCount: countByOwner.get(String(owner._id)) || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('listOwners error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Register a new Owner account (Admin only) — role forced server-side
const createOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with a letter and a number' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const owner = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'owner',
      active: true,
      emailVerified: true,
    });

    res.status(201).json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      active: owner.active,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    console.error('createOwner error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Shared lookup guard — this resource can only ever touch Owner accounts,
// never Admin accounts (a leaked Owner-management endpoint should never be
// able to lock out or repurpose the technical Admin).
const findEditableOwner = async (id, res) => {
  const account = await User.findById(id);
  if (!account) {
    res.status(404).json({ error: 'Owner not found' });
    return null;
  }
  if (account.role !== 'owner') {
    res.status(403).json({ error: 'This endpoint can only manage Owner accounts' });
    return null;
  }
  return account;
};

// Edit an Owner's name/email (Admin only)
const updateOwnerDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    const owner = await findEditableOwner(req.params.id, res);
    if (!owner) return;

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== owner.email) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(409).json({ error: 'An account with this email already exists' });
        }
        owner.email = normalizedEmail;
      }
    }
    if (name) owner.name = name.trim();

    await owner.save();
    res.status(200).json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      active: owner.active,
    });
  } catch (error) {
    console.error('updateOwnerDetails error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Activate / deactivate an Owner (Admin only)
const setOwnerStatus = async (req, res) => {
  try {
    const { active } = req.body;
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'active must be true or false' });
    }

    const owner = await findEditableOwner(req.params.id, res);
    if (!owner) return;

    owner.active = active;
    owner.tokenVersion = (owner.tokenVersion || 0) + 1; // revoke existing sessions
    await owner.save();

    res.status(200).json({ _id: owner._id, active: owner.active });
  } catch (error) {
    console.error('setOwnerStatus error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Reset an Owner's password (Admin only)
const resetOwnerPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with a letter and a number' });
    }

    const owner = await findEditableOwner(req.params.id, res);
    if (!owner) return;

    const salt = await bcrypt.genSalt(10);
    owner.passwordHash = await bcrypt.hash(newPassword, salt);
    owner.tokenVersion = (owner.tokenVersion || 0) + 1; // revoke existing sessions
    await owner.save();

    res.status(200).json({ message: 'Owner password reset successfully' });
  } catch (error) {
    console.error('resetOwnerPassword error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Delete an Owner (Admin only) — their tours/images are soft-hidden
// (active: false) rather than deleted outright, so past inquiries referencing
// them stay readable and nothing is orphaned.
const deleteOwner = async (req, res) => {
  try {
    const owner = await findEditableOwner(req.params.id, res);
    if (!owner) return;

    await Promise.all([
      Tour.updateMany({ ownerId: owner._id }, { $set: { active: false } }),
      Gallery.updateMany({ ownerId: owner._id }, { $set: { active: false } }),
    ]);
    await owner.deleteOne();

    res.status(200).json({
      message: 'Owner deleted successfully. Their tours and images were hidden, not deleted, to avoid orphaning past inquiries.',
    });
  } catch (error) {
    console.error('deleteOwner error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = {
  listOwners,
  createOwner,
  updateOwnerDetails,
  setOwnerStatus,
  resetOwnerPassword,
  deleteOwner,
};
