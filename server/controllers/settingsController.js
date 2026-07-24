const Settings = require('../models/Settings');

// Get global settings (Public)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update global settings (Admin only)
const updateSettings = async (req, res) => {
  try {
    const { phone, whatsapp, wechatId, email, address } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (phone !== undefined) settings.phone = phone;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;
    if (wechatId !== undefined) settings.wechatId = wechatId;
    if (email !== undefined) settings.email = email;
    if (address !== undefined) settings.address = address;

    await settings.save();

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
