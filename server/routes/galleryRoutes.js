const express = require('express');
const {
  getActiveGallery,
  getManageGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { requireOwnership, scopeToOwner } = require('../middlewares/ownership');
const { auditLog } = require('../middlewares/audit');
const { validateGallery } = require('../middlewares/validators/galleryValidators');
const Gallery = require('../models/Gallery');

const router = express.Router();

// Public route
router.get('/', getActiveGallery);

// Dashboard list — Owner sees only their own images; Admin sees all
router.get('/manage', requireAuth, requireRole('owner'), scopeToOwner, getManageGallery);

// Protected routes — gallery manager is shared by Owner and Admin.
router.post('/', requireAuth, requireRole('owner'), validateGallery, auditLog('gallery.create', 'Gallery'), createGalleryItem);
router.patch(
  '/:id',
  requireAuth,
  requireRole('owner'),
  requireOwnership(Gallery),
  validateGallery,
  auditLog('gallery.update', 'Gallery'),
  updateGalleryItem
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('owner'),
  requireOwnership(Gallery),
  auditLog('gallery.delete', 'Gallery'),
  deleteGalleryItem
);

module.exports = router;
