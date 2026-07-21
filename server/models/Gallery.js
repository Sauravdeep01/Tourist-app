const mongoose = require('mongoose');

// Helper for bilingual fields
const bilingualSchema = {
  en: { type: String, default: '' },
  zh: { type: String, default: '' },
};

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    caption: bilingualSchema,
    tourTag: {
      type: String,
      trim: true,
      default: '',
    },
    destinationTag: {
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
