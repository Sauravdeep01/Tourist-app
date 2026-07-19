const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // At least one of these three must be present, validated at the API/Controller level
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    phoneCountryCode: {
      type: String,
      trim: true,
      default: '',
    },
    wechatId: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      default: 'China',
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    tourTitle: {
      type: String,
      required: true, 
    },
    groupSize: {
      type: Number,
      default: 1,
      min: 1,
    },
    travelDate: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      maxlength: 3000,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'booked', 'closed'],
      default: 'new',
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
