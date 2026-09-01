const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    department: {
      type: String,
      default: 'Business',
    },
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        'Business Executive',
        'Business Development Executive',
        'HR Executive',
        'HR Recruiter',
        'Talent Acquisition Executive',
        'Sales Executive',
        'Marketing Executive',
        'Customer Relationship Executive',
        'Customer Support Executive',
        'Operations Executive',
        'Accounts Executive',
        'Finance Executive',
        'Office Executive',
        'Admin Executive',
        'Back Office Executive',
        'Relationship Manager',
        'Other',
      ],
    },
    industry: {
      type: String,
      default: 'Corporate Services',
    },
    location: {
      city: { type: String, required: true, index: true },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site',
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    experience: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 2 },
    },
    salary: {
      min: { type: Number, default: 250000 },
      max: { type: Number, default: 450000 },
      currency: { type: String, default: 'INR' },
    },
    qualification: {
      type: [String],
      default: ['Any Graduate', 'BBA', 'B.Com', 'MBA'],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: ['Health Insurance', 'Performance Bonus', 'Paid Leave'],
    },
    openings: {
      type: Number,
      default: 2,
    },
    applicationDeadline: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'expired'],
      default: 'active',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
