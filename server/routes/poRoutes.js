const express = require('express');
const router = express.Router();
const poController = require('../controllers/poController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, poController.getPurchaseOrders);

module.exports = router;
