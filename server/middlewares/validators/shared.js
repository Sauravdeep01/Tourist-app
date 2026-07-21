const sanitizeHtml = require('sanitize-html');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WECHAT_RE = /^[A-Za-z0-9_-]{6,20}$/;
const SLUG_RE = /^[a-z0-9-]+$/;
const PHONE_RE = /^\d{10}$/;
const E164_RE = /^\+?\d{8,15}$/;
const HTTP_URL_RE = /^https?:\/\/.+/i;

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const hasValue = (v) => v !== undefined && v !== null && v !== '';

const respondWithErrors = (res, errors) => res.status(400).json({ errors });

// Recursively strips HTML and script tags from input data to prevent Stored XSS
const sanitizeValue = (val, keyName = '') => {
  // Preserve raw password strings (passwords are hashed directly and never rendered in HTML)
  if (keyName.toLowerCase().includes('password')) {
    return val;
  }
  if (typeof val === 'string') {
    return sanitizeHtml(val, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeValue(item, keyName));
  }
  if (typeof val === 'object' && val !== null) {
    const cleaned = {};
    for (const key of Object.keys(val)) {
      cleaned[key] = sanitizeValue(val[key], key);
    }
    return cleaned;
  }
  return val;
};

module.exports = {
  EMAIL_RE,
  WECHAT_RE,
  SLUG_RE,
  PHONE_RE,
  E164_RE,
  HTTP_URL_RE,
  isNonEmptyString,
  hasValue,
  respondWithErrors,
  sanitizeValue,
};
