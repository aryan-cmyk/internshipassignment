const express = require('express');
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Protect all wallet routes

router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);
router.post('/transfer', walletController.transfer);
router.get('/history', walletController.history);
router.get('/balance', walletController.getBalance);

module.exports = router;
