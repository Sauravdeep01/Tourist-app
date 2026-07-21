const multer = require('multer');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, or WEBP images are allowed'));
    }
    cb(null, true);
  },
});

// Wraps multer so upload errors (bad type, too large) come back in the same
// { errors: [{ field, message }] } shape every other form on the site uses.
const uploadImageFile = (req, res, next) => {
  multerUpload.single('image')(req, res, (err) => {
    if (!err) return next();

    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller' : err.message;

    res.status(400).json({ errors: [{ field: 'image', message }] });
  });
};

module.exports = { uploadImageFile };
