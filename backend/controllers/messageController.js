const Message = require('../models/Message');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getMessages = async (req, res, next) => {
  try {
    const { read, replied, limit = 50, page = 1 } = req.query;
    const query = {};

    if (read) query.read = read === 'true';
    if (replied) query.replied = replied === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Message.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status
// @route   PUT /api/messages/:id
// @access  Private/Admin
exports.updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Update only allowed fields
    if (req.body.read !== undefined) message.read = req.body.read;
    if (req.body.replied !== undefined) message.replied = req.body.replied;

    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message statistics
// @route   GET /api/messages/stats
// @access  Private/Admin
exports.getMessageStats = async (req, res, next) => {
  try {
    const [total, unread, replied] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Message.countDocuments({ replied: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        replied,
        read: total - unread
      }
    });
  } catch (error) {
    next(error);
  }
};