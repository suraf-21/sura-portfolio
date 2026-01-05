const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  page: {
    type: String,
    default: 'home',
    enum: ['home', 'projects', 'blogs', 'contact']
  },
  referrer: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for analytics queries
profileViewSchema.index({ createdAt: 1 });
profileViewSchema.index({ page: 1, createdAt: 1 });

// Static method to get view counts by period
profileViewSchema.statics.getViewStats = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('ProfileView', profileViewSchema);