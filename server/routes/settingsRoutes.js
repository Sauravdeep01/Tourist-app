const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getSettings);
router.put('/', requireAuth, requireRole('admin'), updateSettings);

module.exports = router;
