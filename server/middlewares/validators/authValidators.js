const { isValidCountryCode } = require('../../utils/countryCodes');
const {
  EMAIL_RE,
  WECHAT_RE,
  PHONE_RE,
  isNonEmptyString,
  hasValue,
  respondWithErrors,
  sanitizeValue,
} = require('./shared');

const validateSignup = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
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

module.exports = { validateSignup, validateLogin };
