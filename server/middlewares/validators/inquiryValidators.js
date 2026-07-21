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

const validateInquiry = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
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

module.exports = { validateInquiry };
