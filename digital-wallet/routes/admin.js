// backend/routes/admin.js
const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.use((req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ msg: 'Admin access only' });
  }
  next();
});

router.get('/flagged-transactions', adminController.viewFlaggedTransactions);
router.get('/aggregate-balances', adminController.aggregateUserBalances);
router.get('/top-users/balance', adminController.topUsersByBalance);
router.get('/top-users/transactions', adminController.topUsersByTransactionVolume);

module.exports = router;
