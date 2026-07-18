const express = require('express');
const {
  listStaffAccounts,
  createOwnerAccount,
  updateOwnerAccount,
} = require('../controllers/accountController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// All accounts routes require admin role
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', listStaffAccounts);
router.post('/', createOwnerAccount);
router.patch('/:id', updateOwnerAccount);

module.exports = router;
