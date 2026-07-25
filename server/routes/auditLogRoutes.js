const express = require('express');
const { getAuditLogs } = require('../controllers/auditLogController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), getAuditLogs);

module.exports = router;
