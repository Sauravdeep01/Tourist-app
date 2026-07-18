const mongoose = require('mongoose');

const bilingualSchema = {
  en: { type: String, default: '' },
  zh: { type: String, default: '' },
};

const settingsSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      default: '',
    },
    whatsapp: {
      type: String,
      default: '',
    },
    wechatId: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    address: bilingualSchema,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
