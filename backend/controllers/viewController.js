const ProfileView = require('../models/ProfileView');

// @desc    Track profile view
// @route   POST /api/views
// @access  Public
exports.trackView = async (req, res, next) => {
  try {
    const { page = 'home' } = req.body;
    
    const view = await ProfileView.create({
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      page,
      referrer: req.headers.referer || 'Direct'
    });

    res.status(201).json({
      success: true,
      message: 'View tracked',
      data: view
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get view statistics
// @route   GET /api/views/stats
// @access  Private/Admin
exports.getViewStats = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    let startDate;

    // Calculate start date based on period
    const now = new Date();
    switch (period) {
      case '1d':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const endDate = new Date();

    // Get total views
    const totalViews = await ProfileView.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Get views by page
    const viewsByPage = await ProfileView.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get daily views
    const dailyViews = await ProfileView.getViewStats(startDate, endDate);

    res.status(200).json({
      success: true,
      data: {
        period,
        totalViews,
        viewsByPage,
        dailyViews,
        startDate,
        endDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get total view count
// @route   GET /api/views/total
// @access  Public
exports.getTotalViews = async (req, res, next) => {
  try {
    const totalViews = await ProfileView.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalViews
      }
    });
  } catch (error) {
    next(error);
  }
};