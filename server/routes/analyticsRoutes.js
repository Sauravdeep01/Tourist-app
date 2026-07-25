const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Owner gets their own totals only; Admin gets the platform-wide view
router.get('/', requireAuth, requireRole('owner'), getAnalytics);

module.exports = router;
