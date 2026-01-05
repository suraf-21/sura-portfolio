const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', messageController.createMessage);

// Protected routes (Admin only)
router.get('/', protect, isAdmin, messageController.getMessages);
router.get('/stats', protect, isAdmin, messageController.getMessageStats);
router.put('/:id', protect, isAdmin, messageController.updateMessage);
router.delete('/:id', protect, isAdmin, messageController.deleteMessage);

module.exports = router;