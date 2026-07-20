const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one feedback entry per user, editable in place
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    reply: {
      text: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      repliedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
