const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { auditLog } = require('../middlewares/audit');
const { validateSettings } = require('../middlewares/validators/settingsValidators');

const router = express.Router();

router.get('/', getSettings);
router.put('/', requireAuth, requireRole('admin'), validateSettings, auditLog('settings.update', 'Settings'), updateSettings);

module.exports = router;
