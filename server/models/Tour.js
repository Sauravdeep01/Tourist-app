const mongoose = require('mongoose');

// Helper for bilingual fields
const bilingualSchema = {
  en: { type: String, default: '' },
  zh: { type: String, default: '' },
};

// Activity sub-schema
const activitySchema = new mongoose.Schema({
  category: bilingualSchema,
  description: bilingualSchema,
}, { _id: false });

// Daily Itinerary sub-schema
const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: bilingualSchema,
  activities: [activitySchema],
  accommodationCity: bilingualSchema,
  meals: bilingualSchema,
}, { _id: false });

// City Stay sub-schema (nights stays per city)
const cityStaySchema = new mongoose.Schema({
  city: bilingualSchema,
  nights: { type: Number, required: true },
}, { _id: false });

// Pricing & Supplement items
const priceItemSchema = new mongoose.Schema({
  label: bilingualSchema,
  amount: bilingualSchema,
}, { _id: false });

// Inclusions / Exclusions items
const inclusionItemSchema = new mongoose.Schema({
  item: bilingualSchema,
  details: bilingualSchema,
}, { _id: false });

const tourSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: bilingualSchema,
    subtitle: bilingualSchema,
    overview: bilingualSchema,
    days: {
      type: Number,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
    },
    itinerary: [itineraryDaySchema],
    cityStays: [cityStaySchema],
    hotelCategory: bilingualSchema,
    pricing: [priceItemSchema],
    supplements: [priceItemSchema],
    priceFrom: {
      type: Number,
      default: null,
    },
    includes: [inclusionItemSchema],
    excludes: [inclusionItemSchema],
    notes: [bilingualSchema],
    coverImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    validFrom: bilingualSchema,
    featured: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Tour', tourSchema);
