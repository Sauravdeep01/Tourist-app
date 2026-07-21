const express = require('express');
const {
  getActiveGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateGallery } = require('../middlewares/validators');

const router = express.Router();

// Public route
router.get('/', getActiveGallery);

// Protected routes — gallery manager is shared by Owner and Admin.
router.post('/', requireAuth, requireRole('owner'), validateGallery, createGalleryItem);
router.patch('/:id', requireAuth, requireRole('owner'), validateGallery, updateGalleryItem);
router.delete('/:id', requireAuth, requireRole('owner'), deleteGalleryItem);

module.exports = router;
