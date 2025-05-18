const express = require('express');
const auth = require('../middlewares/authMiddleware');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const router = express.Router();

router.post('/send', auth, sendOTP);
router.post('/verify', auth, verifyOTP);

module.exports = router;
