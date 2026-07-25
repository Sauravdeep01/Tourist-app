const express = require('express');
const {
  getActiveDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { auditLog } = require('../middlewares/audit');
const { validateDestination } = require('../middlewares/validators/destinationValidators');

const router = express.Router();

// Public routes
router.get('/', getActiveDestinations);
router.get('/:slug', getDestinationBySlug);

// Protected routes — destinations are shared/global content (no ownerId),
// so any Owner may edit one, but only Admin may create/delete.
router.post('/', requireAuth, requireRole('admin'), validateDestination, auditLog('destination.create', 'Destination'), createDestination);
router.put('/:id', requireAuth, requireRole('owner'), validateDestination, auditLog('destination.update', 'Destination'), updateDestination);
router.delete('/:id', requireAuth, requireRole('admin'), auditLog('destination.delete', 'Destination'), deleteDestination);

module.exports = router;
