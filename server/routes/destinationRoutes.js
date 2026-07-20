const express = require('express');
const {
  getActiveDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateDestination } = require('../middlewares/validators');

const router = express.Router();

// Public routes
router.get('/', getActiveDestinations);
router.get('/:slug', getDestinationBySlug);

// Protected routes
router.post('/', requireAuth, requireRole('admin'), validateDestination, createDestination);
router.put('/:id', requireAuth, requireRole('owner'), validateDestination, updateDestination);
router.delete('/:id', requireAuth, requireRole('admin'), deleteDestination);

module.exports = router;
