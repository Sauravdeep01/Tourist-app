const { SLUG_RE, HTTP_URL_RE, isNonEmptyString, hasValue, respondWithErrors, sanitizeValue } = require('./shared');

const validateDestination = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  const errors = [];
  const { slug, name, rating, coverImage, images } = req.body;

  if (req.method === 'POST' && !hasValue(slug)) {
    errors.push({ field: 'slug', message: 'Slug is required' });
  }
  if (hasValue(slug) && !SLUG_RE.test(slug)) {
    errors.push({ field: 'slug', message: 'Slug may only contain lowercase letters, numbers and hyphens' });
  }

  if (req.method === 'POST' || hasValue(name)) {
    const nameEn = name?.en;
    const nameZh = name?.zh;
    if (!isNonEmptyString(nameEn) || !isNonEmptyString(nameZh)) {
      errors.push({ field: 'name', message: 'Name is required in both languages' });
    } else if (nameEn.length > 60 || nameZh.length > 60) {
      errors.push({ field: 'name', message: 'Name must be 60 characters or fewer' });
    }
  }

  if (hasValue(rating)) {
    const numericRating = Number(rating);
    const roundedToOneDecimal = Math.round(numericRating * 10) / 10;
    if (Number.isNaN(numericRating) || numericRating < 0 || numericRating > 5 || roundedToOneDecimal !== numericRating) {
      errors.push({ field: 'rating', message: 'Rating must be between 0 and 5' });
    }
  }

  if (hasValue(coverImage) && !HTTP_URL_RE.test(coverImage)) {
    errors.push({ field: 'coverImage', message: 'Image must be a valid URL' });
  }

  if (images !== undefined) {
    if (!Array.isArray(images)) {
      errors.push({ field: 'images', message: 'Image must be a valid URL' });
    } else if (images.length > 12) {
      errors.push({ field: 'images', message: 'Maximum 12 gallery images' });
    } else if (images.some((url) => !HTTP_URL_RE.test(url))) {
      errors.push({ field: 'images', message: 'Image must be a valid URL' });
    }
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

module.exports = { validateDestination };
