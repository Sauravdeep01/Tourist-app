const express = require('express');
const {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { requireAuth, requireRole, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public submission route (processes token optionally if user is logged in)
router.post('/', optionalAuth, createInquiry);

// Tourist specific routes
router.get('/mine', requireAuth, requireRole('user'), getMyInquiries);

// Staff specific routes (Owner or Admin)
router.get('/', requireAuth, requireRole('owner'), getInquiries);
router.patch('/:id', requireAuth, requireRole('owner'), updateInquiry);
router.delete('/:id', requireAuth, requireRole('owner'), deleteInquiry);

module.exports = router;
