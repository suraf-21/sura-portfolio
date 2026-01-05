const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.post('/logout', protect, adminController.logout);
router.get('/me', protect, adminController.getMe);
router.get('/dashboard', protect, isAdmin, adminController.getDashboardStats);

module.exports = router;