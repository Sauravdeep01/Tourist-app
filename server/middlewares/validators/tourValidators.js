const { SLUG_RE, isNonEmptyString, hasValue, respondWithErrors, sanitizeValue } = require('./shared');

const validateTour = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
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

module.exports = { validateTour };
