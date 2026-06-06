const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, rfqController.getRfqs);
router.post('/', authenticateToken, requireRole('Admin'), rfqController.createRfq);
router.put('/:id/publish', authenticateToken, requireRole('Admin'), rfqController.publishRfq);

module.exports = router;
