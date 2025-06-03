const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, validateResults } = require('../utils/validation');

const router = express.Router();

router.post('/register', registerValidation, validateResults, register);
router.post('/login', loginValidation, validateResults, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
