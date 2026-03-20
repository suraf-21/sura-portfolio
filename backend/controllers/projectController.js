const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;
    const query = {};

    if (category && category !== 'all') query.category = category;
    if (featured) query.featured = featured === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Project.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Increment view count
    project.views += 1;
    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project with file uploads
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    
    // Parse technologies if it's a string (from FormData)
    if (projectData.technologies && typeof projectData.technologies === 'string') {
      try {
        projectData.technologies = JSON.parse(projectData.technologies);
      } catch (e) {
        projectData.technologies = projectData.technologies.split(',').map(t => t.trim());
      }
    }

    // Handle image upload
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'portfolio/projects/images',
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
      });
      projectData.image = result.secure_url;
      projectData.imagePublicId = result.public_id;
    }

    // Handle video upload
    if (req.files && req.files.video) {
      const result = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
        folder: 'portfolio/projects/videos',
        resource_type: 'video',
        chunk_size: 6000000,
        eager: [
          { width: 800, height: 600, crop: 'pad', audio_codec: 'aac' },
          { quality: 'auto', fetch_format: 'mp4' }
        ]
      });
      projectData.video = result.secure_url;
      projectData.videoPublicId = result.public_id;
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project with file uploads
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const projectData = { ...req.body };

    // Parse technologies if it's a string (from FormData)
    if (projectData.technologies && typeof projectData.technologies === 'string') {
      try {
        projectData.technologies = JSON.parse(projectData.technologies);
      } catch (e) {
        projectData.technologies = projectData.technologies.split(',').map(t => t.trim());
      }
    }

    // Handle image upload
    if (req.files && req.files.image) {
      // Delete old image from cloudinary
      if (project.imagePublicId) {
        await cloudinary.uploader.destroy(project.imagePublicId);
      }
      
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'portfolio/projects/images',
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
      });
      projectData.image = result.secure_url;
      projectData.imagePublicId = result.public_id;
    }

    // Handle video upload
    if (req.files && req.files.video) {
      // Delete old video from cloudinary
      if (project.videoPublicId) {
        await cloudinary.uploader.destroy(project.videoPublicId, { resource_type: 'video' });
      }
      
      const result = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
        folder: 'portfolio/projects/videos',
        resource_type: 'video',
        chunk_size: 6000000,
        eager: [
          { width: 800, height: 600, crop: 'pad', audio_codec: 'aac' },
          { quality: 'auto', fetch_format: 'mp4' }
        ]
      });
      projectData.video = result.secure_url;
      projectData.videoPublicId = result.public_id;
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete images from cloudinary
    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    }
    
    // Delete video from cloudinary
    if (project.videoPublicId) {
      await cloudinary.uploader.destroy(project.videoPublicId, { resource_type: 'video' });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};