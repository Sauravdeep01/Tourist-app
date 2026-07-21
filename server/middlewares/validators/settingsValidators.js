const { EMAIL_RE, WECHAT_RE, E164_RE, hasValue, respondWithErrors, sanitizeValue } = require('./shared');

const validateSettings = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
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

module.exports = { validateSettings };
