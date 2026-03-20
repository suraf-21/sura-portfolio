const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const { published = 'true', tag, limit = 20, page = 1 } = req.query;
    const query = {};

    if (published === 'true') query.published = true;
    if (tag) query.tags = tag.toLowerCase();

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Blog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (!blog.published) {
      return res.status(403).json({
        success: false,
        message: 'Blog is not published'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog with file uploads
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };
    
    // Parse tags if it's a string (from FormData)
    if (blogData.tags && typeof blogData.tags === 'string') {
      try {
        blogData.tags = JSON.parse(blogData.tags);
      } catch (e) {
        blogData.tags = blogData.tags.split(',').map(tag => tag.trim().toLowerCase());
      }
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      const result = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
        folder: 'portfolio/blogs/images',
        transformation: [{ width: 1200, height: 630, crop: 'limit' }] // Blog cover size
      });
      blogData.coverImage = result.secure_url;
      blogData.coverImagePublicId = result.public_id;
    }

    // Handle video upload (optional)
    if (req.files && req.files.video) {
      const result = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
        folder: 'portfolio/blogs/videos',
        resource_type: 'video',
        chunk_size: 6000000,
        eager: [
          { width: 800, height: 600, crop: 'pad', audio_codec: 'aac' },
          { quality: 'auto', fetch_format: 'mp4' }
        ]
      });
      blogData.video = result.secure_url;
      blogData.videoPublicId = result.public_id;
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog with file uploads
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const blogData = { ...req.body };

    // Parse tags if it's a string (from FormData)
    if (blogData.tags && typeof blogData.tags === 'string') {
      try {
        blogData.tags = JSON.parse(blogData.tags);
      } catch (e) {
        blogData.tags = blogData.tags.split(',').map(tag => tag.trim().toLowerCase());
      }
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      // Delete old image from cloudinary
      if (blog.coverImagePublicId) {
        await cloudinary.uploader.destroy(blog.coverImagePublicId);
      }
      
      const result = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
        folder: 'portfolio/blogs/images',
        transformation: [{ width: 1200, height: 630, crop: 'limit' }]
      });
      blogData.coverImage = result.secure_url;
      blogData.coverImagePublicId = result.public_id;
    }

    // Handle video upload
    if (req.files && req.files.video) {
      // Delete old video from cloudinary
      if (blog.videoPublicId) {
        await cloudinary.uploader.destroy(blog.videoPublicId, { resource_type: 'video' });
      }
      
      const result = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
        folder: 'portfolio/blogs/videos',
        resource_type: 'video',
        chunk_size: 6000000,
        eager: [
          { width: 800, height: 600, crop: 'pad', audio_codec: 'aac' },
          { quality: 'auto', fetch_format: 'mp4' }
        ]
      });
      blogData.video = result.secure_url;
      blogData.videoPublicId = result.public_id;
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      blogData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Delete images from cloudinary
    if (blog.coverImagePublicId) {
      await cloudinary.uploader.destroy(blog.coverImagePublicId);
    }
    
    // Delete video from cloudinary
    if (blog.videoPublicId) {
      await cloudinary.uploader.destroy(blog.videoPublicId, { resource_type: 'video' });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog tags
// @route   GET /api/blogs/tags/all
// @access  Public
exports.getBlogTags = async (req, res, next) => {
  try {
    const tags = await Blog.distinct('tags');
    
    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags.filter(tag => tag) // Remove null/empty tags
    });
  } catch (error) {
    next(error);
  }
};