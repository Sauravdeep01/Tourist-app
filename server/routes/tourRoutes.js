const express = require('express');
const {
  getActiveTours,
  getManageTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { requireOwnership, scopeToOwner } = require('../middlewares/ownership');
const { auditLog } = require('../middlewares/audit');
const { validateTour } = require('../middlewares/validators/tourValidators');
const Tour = require('../models/Tour');

const router = express.Router();

// Public routes
router.get('/', getActiveTours);

// Dashboard list — must come before '/:slug' or Express would treat "manage" as a slug
router.get('/manage', requireAuth, requireRole('owner'), scopeToOwner, getManageTours);

router.get('/:slug', getTourBySlug);

// Protected routes — Owner manages only their own tours; Admin manages all 
router.post('/', requireAuth, requireRole('owner'), validateTour, auditLog('tour.create', 'Tour'), createTour);
router.put(
  '/:id',
  requireAuth,
  requireRole('owner'),
  requireOwnership(Tour),
  validateTour,
  auditLog('tour.update', 'Tour'),
  updateTour
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('owner'),
  requireOwnership(Tour),
  auditLog('tour.delete', 'Tour'),
  deleteTour
);

module.exports = router;
