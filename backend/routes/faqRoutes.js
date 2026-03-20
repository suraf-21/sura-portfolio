const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', faqController.getFAQs);
router.get('/categories/all', faqController.getCategories);
router.get('/:id', faqController.getFAQById);

// Admin only routes
router.post('/', protect, isAdmin, faqController.createFAQ);
router.put('/reorder', protect, isAdmin, faqController.reorderFAQs);
router.put('/:id', protect, isAdmin, faqController.updateFAQ);
router.delete('/:id', protect, isAdmin, faqController.deleteFAQ);

module.exports = router;