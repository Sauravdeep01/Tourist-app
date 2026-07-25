const express = require('express');
const {
  listOwners,
  createOwner,
  updateOwnerDetails,
  setOwnerStatus,
  resetOwnerPassword,
  deleteOwner,
} = require('../controllers/ownerController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { auditLog } = require('../middlewares/audit');

const router = express.Router();

// Every route here is Admin-only — Owners always get 403
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', listOwners);
router.post('/', auditLog('owner.create', 'User'), createOwner);
router.put('/:id', auditLog('owner.update', 'User'), updateOwnerDetails);
router.patch('/:id/status', auditLog('owner.status', 'User'), setOwnerStatus);
router.patch('/:id/password', auditLog('owner.password_reset', 'User'), resetOwnerPassword);
router.delete('/:id', auditLog('owner.delete', 'User'), deleteOwner);

module.exports = router;
