const FAQ = require('../models/FAQ');

// @desc    Get all active FAQs (Public)
// @route   GET /api/faqs
// @access  Public
exports.getFAQs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const faqs = await FAQ.find(query).sort('order createdAt');

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single FAQ (Public)
// @route   GET /api/faqs/:id
// @access  Public
exports.getFAQById = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Increment view count
    faq.views += 1;
    await faq.save();

    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create FAQ (Admin only)
// @route   POST /api/faqs
// @access  Private/Admin
exports.createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);

    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ (Admin only)
// @route   PUT /api/faqs/:id
// @access  Private/Admin
exports.updateFAQ = async (req, res, next) => {
  try {
    let faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ (Admin only)
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
exports.deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get FAQ categories (Public)
// @route   GET /api/faqs/categories/all
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await FAQ.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder FAQs (Admin only)
// @route   PUT /api/faqs/reorder
// @access  Private/Admin
exports.reorderFAQs = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    const updatePromises = items.map((item, index) => 
      FAQ.findByIdAndUpdate(item._id, { order: index })
    );
    
    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'FAQs reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};