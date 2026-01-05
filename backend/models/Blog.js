const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image URL is required'],
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  readTime: {
    type: Number,
    default: 5,
    min: [1, 'Read time must be at least 1 minute']
  },
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  next();
});

// Index for faster queries
blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', blogSchema);