const express = require('express');
const {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Submission requires a logged-in tourist account (C-6) — every inquiry is tied to a registered user
router.post('/', requireAuth, createInquiry);

// Tourist specific routes
router.get('/mine', requireAuth, requireRole('user'), getMyInquiries);

// Staff specific routes (Owner or Admin)
router.get('/', requireAuth, requireRole('owner'), getInquiries);
router.patch('/:id', requireAuth, requireRole('owner'), updateInquiry);
router.delete('/:id', requireAuth, requireRole('owner'), deleteInquiry);

module.exports = router;
