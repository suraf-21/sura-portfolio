const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [200, 'Question cannot be more than 200 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    maxlength: [1000, 'Answer cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: ['general', 'technical', 'pricing', 'support', 'other'],
    default: 'general'
  },
  icon: {
    type: String,
    default: '❓'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
faqSchema.index({ order: 1, createdAt: -1 });
faqSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('FAQ', faqSchema);