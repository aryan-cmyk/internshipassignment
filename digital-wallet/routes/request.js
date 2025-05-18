const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const requestController = require('../controllers/requestController');

router.post('/create', auth, requestController.createRequest);

module.exports = router;
