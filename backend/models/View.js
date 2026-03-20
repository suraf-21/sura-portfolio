const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['profile', 'project', 'blog'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemModel',
    required: function() {
      return this.type !== 'profile';
    }
  },
  itemModel: {
    type: String,
    enum: ['Project', 'Blog'],
    required: function() {
      return this.type !== 'profile';
    }
  },
  visitorId: {
    type: String, // IP + User Agent hash or session ID
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  referrer: {
    type: String,
    default: 'direct'
  },
  userAgent: {
    type: String
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'bot'],
    default: 'desktop'
  },
  browser: {
    type: String
  },
  os: {
    type: String
  },
  duration: {
    type: Number, // seconds spent on page
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
viewSchema.index({ type: 1, timestamp: -1 });
viewSchema.index({ itemId: 1, timestamp: -1 });
viewSchema.index({ visitorId: 1, timestamp: -1 });

module.exports = mongoose.model('View', viewSchema);