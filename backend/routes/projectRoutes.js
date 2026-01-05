const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);

// Protected routes (Admin only)
router.post('/', protect, isAdmin, projectController.createProject);
router.put('/:id', protect, isAdmin, projectController.updateProject);
router.delete('/:id', protect, isAdmin, projectController.deleteProject);

module.exports = router;