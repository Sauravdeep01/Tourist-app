const express = require('express');
const {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiry,
  assignInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { requireAuth, requireRole, requireVerified } = require('../middlewares/authMiddleware');
const { requireOwnership, scopeToOwner } = require('../middlewares/ownership');
const { auditLog } = require('../middlewares/audit');
const { validateInquiry } = require('../middlewares/validators/inquiryValidators');
const Inquiry = require('../models/Inquiry');

const router = express.Router();


router.post('/', requireAuth, requireVerified, validateInquiry, createInquiry);

// Tourist specific routes
router.get('/mine', requireAuth, requireRole('user'), getMyInquiries);

// Staff specific routes (Owner or Admin)
router.get('/', requireAuth, requireRole('owner'), scopeToOwner, getInquiries);
router.patch('/:id/assign', requireAuth, requireRole('admin'), auditLog('inquiry.assign', 'Inquiry'), assignInquiry);
router.patch(
  '/:id',
  requireAuth,
  requireRole('owner'),
  requireOwnership(Inquiry),
  auditLog('inquiry.status', 'Inquiry'),
  updateInquiry
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('owner'),
  requireOwnership(Inquiry),
  auditLog('inquiry.delete', 'Inquiry'),
  deleteInquiry
);

module.exports = router;
