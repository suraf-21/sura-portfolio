const View = require('../models/View');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const UAParser = require('ua-parser-js');

// Helper function to get visitor ID
const getVisitorId = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'unknown';
  // Simple hash function
  let hash = 0;
  const str = ip + userAgent;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  return {
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
    device: result.device.type || 'desktop'
  };
};

// @desc    Track profile view
// @route   POST /api/views/profile
// @access  Public
exports.trackProfileView = async (req, res, next) => {
  try {
    const visitorId = getVisitorId(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const { browser, os, device } = parseUserAgent(userAgent);
    
    // Check if same visitor viewed in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingView = await View.findOne({
      type: 'profile',
      visitorId,
      timestamp: { $gte: oneHourAgo }
    });

    if (!existingView) {
      await View.create({
        type: 'profile',
        visitorId,
        userAgent,
        referrer: req.headers.referer || 'direct',
        browser,
        os,
        device,
        country: req.headers['cf-ipcountry'] || 'Unknown'
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Track project view
// @route   POST /api/views/project/:id
// @access  Public
exports.trackProjectView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visitorId = getVisitorId(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const { browser, os, device } = parseUserAgent(userAgent);
    
    // Check if project exists
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if same visitor viewed in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingView = await View.findOne({
      type: 'project',
      itemId: id,
      visitorId,
      timestamp: { $gte: oneHourAgo }
    });

    if (!existingView) {
      await View.create({
        type: 'project',
        itemId: id,
        itemModel: 'Project',
        visitorId,
        userAgent,
        referrer: req.headers.referer || 'direct',
        browser,
        os,
        device,
        country: req.headers['cf-ipcountry'] || 'Unknown'
      });

      // Increment project view count
      project.views += 1;
      await project.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Track blog view
// @route   POST /api/views/blog/:id
// @access  Public
exports.trackBlogView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visitorId = getVisitorId(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const { browser, os, device } = parseUserAgent(userAgent);
    
    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check if same visitor viewed in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingView = await View.findOne({
      type: 'blog',
      itemId: id,
      visitorId,
      timestamp: { $gte: oneHourAgo }
    });

    if (!existingView) {
      await View.create({
        type: 'blog',
        itemId: id,
        itemModel: 'Blog',
        visitorId,
        userAgent,
        referrer: req.headers.referer || 'direct',
        browser,
        os,
        device,
        country: req.headers['cf-ipcountry'] || 'Unknown'
      });

      // Increment blog view count
      blog.views += 1;
      await blog.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Update view duration
// @route   PUT /api/views/:id/duration
// @access  Public
exports.updateViewDuration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { duration } = req.body;

    await View.findByIdAndUpdate(id, { duration });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get view statistics (Admin only)
// @route   GET /api/views/stats
// @access  Private/Admin
exports.getViewStats = async (req, res, next) => {
  try {
    const { type, startDate, endDate, limit = 100 } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Get total counts
    const [
      totalProfileViews,
      totalProjectViews,
      totalBlogViews,
      uniqueVisitors,
      recentViews,
      topProjects,
      topBlogs
    ] = await Promise.all([
      View.countDocuments({ type: 'profile' }),
      View.countDocuments({ type: 'project' }),
      View.countDocuments({ type: 'blog' }),
      View.distinct('visitorId').countDocuments(),
      View.find(query)
        .sort('-timestamp')
        .limit(parseInt(limit))
        .populate('itemId', 'title slug'),
      View.aggregate([
        { $match: { type: 'project' } },
        { $group: { _id: '$itemId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
        { $unwind: '$project' }
      ]),
      View.aggregate([
        { $match: { type: 'blog' } },
        { $group: { _id: '$itemId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'blogs', localField: '_id', foreignField: '_id', as: 'blog' } },
        { $unwind: '$blog' }
      ])
    ]);

    // Get views by day for chart
    const viewsByDay = await View.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          unique: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1,
          uniqueCount: { $size: '$unique' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get device stats
    const deviceStats = await View.aggregate([
      { $match: query },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get browser stats
    const browserStats = await View.aggregate([
      { $match: query },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get country stats
    const countryStats = await View.aggregate([
      { $match: query },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          profile: totalProfileViews,
          projects: totalProjectViews,
          blogs: totalBlogViews,
          all: totalProfileViews + totalProjectViews + totalBlogViews,
          uniqueVisitors
        },
        charts: {
          viewsByDay,
          deviceStats,
          browserStats,
          countryStats
        },
        topContent: {
          projects: topProjects,
          blogs: topBlogs
        },
        recentViews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed views (Admin only)
// @route   GET /api/views/all
// @access  Private/Admin
exports.getAllViews = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (type) query.type = type;

    const [views, total] = await Promise.all([
      View.find(query)
        .sort('-timestamp')
        .skip(skip)
        .limit(parseInt(limit))
        .populate('itemId', 'title slug'),
      View.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: views.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: views
    });
  } catch (error) {
    next(error);
  }
};