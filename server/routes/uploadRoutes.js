const express = require('express');
const { uploadImage, removeImage } = require('../controllers/uploadController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { uploadImageFile } = require('../middlewares/upload');

const router = express.Router();

router.post('/', requireAuth, requireRole('owner'), uploadImageFile, uploadImage);
router.delete('/', requireAuth, requireRole('owner'), removeImage);

module.exports = router;
