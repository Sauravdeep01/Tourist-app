const express = require('express');
const { signup, login, getMe, updateMe, changePassword } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Protected routes (any authenticated role)
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.patch('/password', requireAuth, changePassword);

module.exports = router;
