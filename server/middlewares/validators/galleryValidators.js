const { HTTP_URL_RE, hasValue, respondWithErrors, sanitizeValue } = require('./shared');

const validateGallery = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  const errors = [];
  const { imageUrl, caption } = req.body;
  const isCreate = req.method === 'POST';

  if (isCreate && !hasValue(imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Please provide a valid image URL' });
  } else if (hasValue(imageUrl) && !HTTP_URL_RE.test(imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Please provide a valid image URL' });
  }

  if (hasValue(caption)) {
    const captionEn = caption?.en || '';
    const captionZh = caption?.zh || '';
    if (captionEn.length > 120 || captionZh.length > 120) {
      errors.push({ field: 'caption', message: 'Caption is too long (max 120 characters)' });
    }
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

module.exports = { validateGallery };
