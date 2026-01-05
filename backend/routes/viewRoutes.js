const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', viewController.trackView);
router.get('/total', viewController.getTotalViews);

// Protected routes (Admin only)
router.get('/stats', protect, isAdmin, viewController.getViewStats);

module.exports = router;