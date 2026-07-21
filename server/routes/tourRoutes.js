const express = require('express');
const {
  getActiveTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateTour } = require('../middlewares/validators/tourValidators');

const router = express.Router();

// Public routes
router.get('/', getActiveTours);
router.get('/:slug', getTourBySlug);

// Protected routes
router.post('/', requireAuth, requireRole('admin'), validateTour, createTour);
router.put('/:id', requireAuth, requireRole('owner'), validateTour, updateTour);
router.delete('/:id', requireAuth, requireRole('admin'), deleteTour);

module.exports = router;
