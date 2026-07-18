const bcrypt = require('bcryptjs');
const User = require('../models/User');

// List staff accounts (Owner and Admin) (Admin only)
const listStaffAccounts = async (req, res) => {
  try {
    // List only staff (roles 'owner' and 'admin')
    const accounts = await User.find({ role: { $in: ['owner', 'admin'] } })
      .select('email name role active createdAt')
      .sort({ role: 1, createdAt: -1 });

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new Owner account (Admin only)
const createOwnerAccount = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create staff account with role forced to 'owner'
    const ownerUser = await User.create({
      email,
      name,
      passwordHash,
      role: 'owner',
      active: true,
    });

    res.status(201).json({
      _id: ownerUser._id,
      email: ownerUser.email,
      name: ownerUser.name,
      role: ownerUser.role,
      active: ownerUser.active,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password or update active status of a staff account (Admin only)
const updateOwnerAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, active } = req.body;

    const account = await User.findById(id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Do not allow updating admin accounts this way
    if (account.role === 'admin') {
      return res.status(403).json({ error: 'Admin accounts cannot be modified via this endpoint' });
    }

    // Update active status if provided
    if (active !== undefined) {
      account.active = active;
    }

    // Reset password if provided
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      account.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await account.save();

    res.status(200).json({
      message: 'Account updated successfully',
      account: {
        _id: account._id,
        email: account.email,
        name: account.name,
        role: account.role,
        active: account.active,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listStaffAccounts,
  createOwnerAccount,
  updateOwnerAccount,
};
