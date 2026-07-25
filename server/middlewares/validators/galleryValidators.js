const { HTTP_URL_RE, hasValue, isNonEmptyString, respondWithErrors, sanitizeValue } = require('./shared');

const validateGallery = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  const errors = [];
  const { imageUrl, imageTitle, destinationName, caption, description } = req.body;
  const isCreate = req.method === 'POST';

  if (isCreate && !hasValue(imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Please provide a valid image URL' });
  } else if (hasValue(imageUrl) && !HTTP_URL_RE.test(imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Please provide a valid image URL' });
  }

  if (isCreate && !isNonEmptyString(imageTitle)) {
    errors.push({ field: 'imageTitle', message: 'Image title is required (max 80 characters)' });
  } else if (hasValue(imageTitle) && String(imageTitle).length > 80) {
    errors.push({ field: 'imageTitle', message: 'Image title is required (max 80 characters)' });
  }

  if (isCreate && !isNonEmptyString(destinationName)) {
    errors.push({ field: 'destinationName', message: 'Please select a destination for this image' });
  }

  if (hasValue(caption)) {
    const captionEn = caption?.en || '';
    const captionZh = caption?.zh || '';
    if (captionEn.length > 120 || captionZh.length > 120) {
      errors.push({ field: 'caption', message: 'Caption is too long (max 120 characters)' });
    }
  }

  if (hasValue(description)) {
    const descriptionEn = description?.en || '';
    const descriptionZh = description?.zh || '';
    if (descriptionEn.length > 120 || descriptionZh.length > 120) {
      errors.push({ field: 'description', message: 'Description is too long (max 120 characters)' });
    }
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

module.exports = { validateGallery };
