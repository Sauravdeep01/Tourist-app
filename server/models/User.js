const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'admin'],
      default: 'user',
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: true,
    },
    phoneCountryCode: {
      type: String,
      default: '+86',
    },
    phone: {
      type: String,
      default: '',
    },
    wechatId: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'China',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);






// Method to verify passwords during authentication
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
