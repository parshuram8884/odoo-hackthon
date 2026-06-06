const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, invoiceController.getInvoices);
router.post('/', authenticateToken, requireRole('Vendor'), invoiceController.raiseInvoice);
router.put('/:id/pay', authenticateToken, requireRole('Admin'), invoiceController.payInvoice);

module.exports = router;
