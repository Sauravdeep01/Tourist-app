const mongoose = require('mongoose');

// Helper for bilingual fields
const bilingualSchema = {
  en: { type: String, default: '' },
  zh: { type: String, default: '' },
};

const destinationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: bilingualSchema,
    stateCountry: bilingualSchema,
    famousFor: bilingualSchema,
    significance: bilingualSchema,
    description: bilingualSchema,
    highlights: [bilingualSchema],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    temperature: {
      winter: bilingualSchema,
      summer: bilingualSchema,
    },
    bestSeason: bilingualSchema,
    visitDuration: bilingualSchema,
    nearestAirport: bilingualSchema,
    coverImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    relatedTours: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
      },
    ],
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

module.exports = mongoose.model('Destination', destinationSchema);
