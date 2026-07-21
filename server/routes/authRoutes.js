const express = require('express');
const {
  signup,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
} = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { validateSignup, validateLogin } = require('../middlewares/validators/authValidators');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes (any authenticated role)
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.patch('/password', requireAuth, changePassword);



module.exports = router;
