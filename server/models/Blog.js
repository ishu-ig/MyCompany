const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Career Advice',
        'HR Careers',
        'Sales Careers',
        'Business Careers',
        'Interview Tips',
        'Resume Tips',
        'Communication Skills',
        'Corporate Etiquette',
        'Fresher Career Guide',
        'Skill Development',
      ],
      default: 'Career Advice',
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: 'Career Advisory Board',
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Blog', blogSchema);
