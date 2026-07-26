const { HTTP_URL_RE, hasValue, isNonEmptyString, respondWithErrors, sanitizeValue } = require('./shared');

const validateGallery = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  const errors = [];
  const { imageUrl } = req.body;
  const isCreate = req.method === 'POST';

  if (isCreate && !hasValue(imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Please provide a valid image URL' });
  } else if (hasValue(imageUrl) && !HTTP_URL_RE.test(imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Please provide a valid image URL' });
  }

  // Set default values if not provided
  if (!req.body.imageTitle) req.body.imageTitle = 'Gallery Photo';
  if (!req.body.destinationName) req.body.destinationName = 'General';

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

module.exports = { validateGallery };
