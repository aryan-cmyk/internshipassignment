const express = require('express');
const { register, login } = require('../controllers/authController');
// Commented until implemented
 const { refreshToken, sendOtp, verifyOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Temporarily comment these
router.post('/refresh-token', refreshToken);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
