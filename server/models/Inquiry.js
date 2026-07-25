const mongoose = require('mongoose');

// Audit trail entry for Admin re-assignments of an inquiry to a different Owner
const assignedOwnerHistorySchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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
    // The Owner who receives this inquiry — derived from the referenced tour's
    // ownerId at submit time so it routes to the correct Owner's dashboard.
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
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
    assignedOwnerHistory: {
      type: [assignedOwnerHistorySchema],
      default: [],
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
