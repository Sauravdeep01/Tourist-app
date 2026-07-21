const { isNonEmptyString, hasValue, respondWithErrors, sanitizeValue } = require('./shared');

const validateFeedback = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  const errors = [];
  const { rating, comment } = req.body;
  const isCreate = req.method === 'POST';

  if (isCreate && !hasValue(rating)) {
    errors.push({ field: 'rating', message: 'Rating is required' });
  } else if (hasValue(rating)) {
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      errors.push({ field: 'rating', message: 'Rating must be a whole number between 1 and 5' });
    }
  }

  if (isCreate && !isNonEmptyString(comment)) {
    errors.push({ field: 'comment', message: 'Comment is required' });
  } else if (hasValue(comment)) {
    if (!isNonEmptyString(comment)) {
      errors.push({ field: 'comment', message: 'Comment cannot be empty' });
    } else if (comment.trim().length > 1000) {
      errors.push({ field: 'comment', message: 'Comment must be 1000 characters or fewer' });
    }
  }

  if (!isCreate && !hasValue(rating) && !hasValue(comment)) {
    errors.push({ field: 'feedback', message: 'Provide a rating or comment to update' });
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

const validateFeedbackReply = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  const errors = [];
  const { text } = req.body;

  if (!isNonEmptyString(text)) {
    errors.push({ field: 'text', message: 'Reply text is required' });
  } else if (text.trim().length > 1000) {
    errors.push({ field: 'text', message: 'Reply must be 1000 characters or fewer' });
  }

  if (errors.length) return respondWithErrors(res, errors);
  next();
};

module.exports = { validateFeedback, validateFeedbackReply };
