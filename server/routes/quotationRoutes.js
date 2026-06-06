const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, quotationController.getQuotations);
router.post('/', authenticateToken, requireRole('Vendor'), quotationController.submitQuotation);
router.put('/:id/status', authenticateToken, requireRole('Admin'), quotationController.updateStatus);
router.put('/:id', authenticateToken, requireRole('Admin'), quotationController.updateQuotation);

module.exports = router;
