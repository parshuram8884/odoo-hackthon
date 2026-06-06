const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/analytics', authenticateToken, requireRole('SuperAdmin'), superadminController.getAnalytics);

module.exports = router;
