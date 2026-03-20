const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const messageController = require('../controllers/messageController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.post('/logout', protect, adminController.logout);
router.get('/me', protect, adminController.getMe);
router.get('/dashboard', protect, isAdmin, adminController.getDashboardStats);

// Message routes (Admin only)
router.get('/messages', protect, isAdmin, messageController.getMessages);
router.get('/messages/stats', protect, isAdmin, messageController.getMessageStats);
router.put('/messages/:id', protect, isAdmin, messageController.updateMessage);
router.delete('/messages/:id', protect, isAdmin, messageController.deleteMessage);

module.exports = router;