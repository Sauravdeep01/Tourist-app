const { isValidCountryCode } = require('../utils/countryCodes');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WECHAT_RE = /^[A-Za-z0-9_-]{6,20}$/;
const SLUG_RE = /^[a-z0-9-]+$/;
const PHONE_RE = /^\d{10}$/;
const E164_RE = /^\+?\d{8,15}$/;

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const hasValue = (v) => v !== undefined && v !== null && v !== '';

const respondWithErrors = (res, errors) => res.status(400).json({ errors });

const validateSignup = (req, res, next) => {
  const errors = [];
  const { name, email, password, phoneCountryCode, phone, wechatId } = req.body;

  if (!isNonEmptyString(name) || name.trim().length < 2 || name.trim().length > 20) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 20 characters' });
  }

  if (!isNonEmptyString(email) || !EMAIL_RE.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!isNonEmptyString(password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters with a letter and a number' });
  }

  if (hasValue(phone)) {
    if (!PHONE_RE.test(phone)) {
      errors.push({ field: 'phone', message: 'Phone number must be exactly 10 digits' });
    }
    if (!isNonEmptyString(phoneCountryCode) || !isValidCountryCode(phoneCountryCode)) {
      errors.push({ field: 'phoneCountryCode', message: 'Please select a country code' });
    }
  }

  if (hasValue(wechatId) && !WECHAT_RE.test(wechatId)) {
    errors.push({ field: 'wechatId', message: 'WeChat ID must be 6–20 characters' });
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

const validateLogin = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body;

  if (!isNonEmptyString(email) || !EMAIL_RE.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  if (!isNonEmptyString(password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

const validateInquiry = (req, res, next) => {
  const errors = [];
  const { name, email, phone, phoneCountryCode, wechatId, groupSize, message } = req.body;

  if (!isNonEmptyString(name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length > 20) {
    errors.push({ field: 'name', message: 'Name must be 20 characters or fewer' });
  }

  if (hasValue(email) && !EMAIL_RE.test(String(email).trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (hasValue(phone)) {
    if (!PHONE_RE.test(phone)) {
      errors.push({ field: 'phone', message: 'Phone number must be exactly 10 digits' });
    }
    if (!isNonEmptyString(phoneCountryCode) || !isValidCountryCode(phoneCountryCode)) {
      errors.push({ field: 'phoneCountryCode', message: 'A country code is required with the phone number' });
    }
  }

  if (hasValue(wechatId) && !WECHAT_RE.test(wechatId)) {
    errors.push({ field: 'wechatId', message: 'WeChat ID must be 6–20 characters' });
  }

  const hasEmail = hasValue(email) && String(email).trim();
  const hasPhone = hasValue(phone) && String(phone).trim();
  const hasWechat = hasValue(wechatId) && String(wechatId).trim();
  if (!hasEmail && !hasPhone && !hasWechat) {
    errors.push({ field: 'contact', message: 'Please provide at least one contact method' });
  }

  if (hasValue(groupSize)) {
    const size = Number(groupSize);
    if (!Number.isInteger(size) || size < 1 || size > 100) {
      errors.push({ field: 'groupSize', message: 'Group size must be between 1 and 100' });
    }
  }

  if (hasValue(message) && String(message).length > 3000) {
    errors.push({ field: 'message', message: 'Message is too long (max 3000 characters)' });
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};



const validateTour = (req, res, next) => {
  const errors = [];
  const { slug, title, days, nights, priceFrom } = req.body;

  if (req.method === 'POST' && !hasValue(slug)) {
    errors.push({ field: 'slug', message: 'Slug is required' });
  }
  if (hasValue(slug) && !SLUG_RE.test(slug)) {
    errors.push({ field: 'slug', message: 'Slug may only contain lowercase letters, numbers and hyphens' });
  }

  if (req.method === 'POST' || hasValue(title)) {
    const titleEn = title?.en;
    const titleZh = title?.zh;
    if (!isNonEmptyString(titleEn) || !isNonEmptyString(titleZh)) {
      errors.push({ field: 'title', message: 'Title is required in both languages' });
    } else if (titleEn.length > 120 || titleZh.length > 120) {
      errors.push({ field: 'title', message: 'Title must be 120 characters or fewer' });
    }
  }

  if (hasValue(days) && (!Number.isInteger(Number(days)) || Number(days) < 1 || Number(days) > 60)) {
    errors.push({ field: 'days', message: 'Days must be between 1 and 60' });
  }
  if (hasValue(nights) && (!Number.isInteger(Number(nights)) || Number(nights) < 1 || Number(nights) > 60)) {
    errors.push({ field: 'nights', message: 'Nights must be between 1 and 60' });
  }

  if (hasValue(priceFrom)) {
    const price = Number(priceFrom);
    if (Number.isNaN(price) || price <= 0 || price > 100000) {
      errors.push({ field: 'priceFrom', message: 'Price must be a positive number' });
    }
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

const validateSettings = (req, res, next) => {
  const errors = [];
  const { phone, whatsapp, email, wechatId } = req.body;

  if (hasValue(phone) && !E164_RE.test(phone)) {
    errors.push({ field: 'phone', message: 'Enter the number with country code, digits only' });
  }
  if (hasValue(whatsapp) && !E164_RE.test(whatsapp)) {
    errors.push({ field: 'whatsapp', message: 'Enter the number with country code, digits only' });
  }
  if (hasValue(email) && !EMAIL_RE.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  if (hasValue(wechatId) && !WECHAT_RE.test(wechatId)) {
    errors.push({ field: 'wechatId', message: 'WeChat ID must be 6–20 characters' });
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateInquiry,
  validateTour,
  validateSettings,
};
