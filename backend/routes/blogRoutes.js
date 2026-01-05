const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', blogController.getBlogs);
router.get('/tags/all', blogController.getBlogTags);
router.get('/:slug', blogController.getBlogBySlug);

// Protected routes (Admin only)
router.post('/', protect, isAdmin, blogController.createBlog);
router.put('/:id', protect, isAdmin, blogController.updateBlog);
router.delete('/:id', protect, isAdmin, blogController.deleteBlog);

module.exports = router;