const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  technologies: [{
    type: String,
    required: true,
    trim: true
  }],
  imageUrl: {
    type: String,
    required: [true, 'Project image URL is required'],
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  githubUrl: {
    type: String,
    required: [true, 'GitHub URL is required'],
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  liveUrl: {
    type: String,
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'fullstack', 'other'],
    default: 'web'
  },
  featured: {
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

// Index for faster queries
projectSchema.index({ category: 1, featured: -1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);