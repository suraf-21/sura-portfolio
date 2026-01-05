const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Message = require('../models/Message');
const ProfileView = require('../models/ProfileView');

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout admin
// @route   POST /api/admin/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalBlogs,
      totalMessages,
      totalViews,
      unreadMessages,
      publishedBlogs,
      featuredProjects
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments(),
      ProfileView.countDocuments(),
      Message.countDocuments({ read: false }),
      Blog.countDocuments({ published: true }),
      Project.countDocuments({ featured: true })
    ]);

    // Get recent activities
    const recentProjects = await Project.find()
      .sort('-createdAt')
      .limit(5)
      .select('title category createdAt');

    const recentMessages = await Message.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email subject read createdAt');

    const recentBlogs = await Blog.find()
      .sort('-createdAt')
      .limit(5)
      .select('title published views createdAt');

    res.status(200).json({
      success: true,
      data: {
        totals: {
          projects: totalProjects,
          blogs: totalBlogs,
          messages: totalMessages,
          views: totalViews,
          unreadMessages,
          publishedBlogs,
          featuredProjects
        },
        recent: {
          projects: recentProjects,
          messages: recentMessages,
          blogs: recentBlogs
        }
      }
    });
  } catch (error) {
    next(error);
  }
};