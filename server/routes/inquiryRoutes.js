const express = require('express');
const {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { requireAuth, requireRole, requireVerified } = require('../middlewares/authMiddleware');
const { validateInquiry } = require('../middlewares/validators');

const router = express.Router();


router.post('/', requireAuth, requireVerified, validateInquiry, createInquiry);

// Tourist specific routes
router.get('/mine', requireAuth, requireRole('user'), getMyInquiries);

// Staff specific routes (Owner or Admin)
router.get('/', requireAuth, requireRole('owner'), getInquiries);
router.patch('/:id', requireAuth, requireRole('owner'), updateInquiry);
router.delete('/:id', requireAuth, requireRole('owner'), deleteInquiry);

module.exports = router;
