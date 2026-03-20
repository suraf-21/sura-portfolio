const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes (for tracking)
router.post('/profile', viewController.trackProfileView);
router.post('/project/:id', viewController.trackProjectView);
router.post('/blog/:id', viewController.trackBlogView);
router.put('/:id/duration', viewController.updateViewDuration);

// Admin only routes
router.get('/stats', protect, isAdmin, viewController.getViewStats);
router.get('/all', protect, isAdmin, viewController.getAllViews);

module.exports = router;