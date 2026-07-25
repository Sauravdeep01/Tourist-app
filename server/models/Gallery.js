const mongoose = require('mongoose');

// Helper for bilingual fields
const bilingualSchema = {
  en: { type: String, default: '' },
  zh: { type: String, default: '' },
};

const gallerySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imageTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    destinationName: {
      type: String,
      required: true,
      trim: true,
    },
    description: bilingualSchema,
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    caption: bilingualSchema,
    tourTag: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Gallery', gallerySchema);
