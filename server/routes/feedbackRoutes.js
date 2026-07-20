const express = require('express');
const {
  createFeedback,
  getPublicFeedback,
  getFeedbackStats,
  getMyFeedback,
  updateMyFeedback,
  deleteMyFeedback,
  getAllFeedbackAdmin,
  replyToFeedback,
  deleteReply,
  setVisibility,
  deleteFeedbackAdmin,
} = require('../controllers/feedbackController');
const { requireAuth, requireRole, requireVerified } = require('../middlewares/authMiddleware');
const { validateFeedback, validateFeedbackReply } = require('../middlewares/validators');

const router = express.Router();

// Public routes
router.get('/', getPublicFeedback);
router.get('/stats', getFeedbackStats);

// Tourist specific routes
router.post('/', requireAuth, requireVerified, requireRole('user'), validateFeedback, createFeedback);
router.get('/mine', requireAuth, requireRole('user'), getMyFeedback);
router.patch('/mine', requireAuth, requireRole('user'), validateFeedback, updateMyFeedback);
router.delete('/mine', requireAuth, requireRole('user'), deleteMyFeedback);

// Staff specific routes (Owner or Admin)
router.get('/admin', requireAuth, requireRole('owner'), getAllFeedbackAdmin);
router.post('/:id/reply', requireAuth, requireRole('owner'), validateFeedbackReply, replyToFeedback);
router.delete('/:id/reply', requireAuth, requireRole('owner'), deleteReply);
router.patch('/:id/visibility', requireAuth, requireRole('owner'), setVisibility);
router.delete('/:id', requireAuth, requireRole('owner'), deleteFeedbackAdmin);

module.exports = router;
