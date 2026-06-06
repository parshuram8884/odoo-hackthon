const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const rfqRoutes = require('./rfqRoutes');
const quotationRoutes = require('./quotationRoutes');
const poRoutes = require('./poRoutes');
const invoiceRoutes = require('./invoiceRoutes');

router.use('/auth', authRoutes);
router.use('/rfqs', rfqRoutes);
router.use('/quotations', quotationRoutes);
router.use('/purchase-orders', poRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;
