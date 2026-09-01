const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=250',
    },
    website: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: 'Corporate Services',
    },
    companySize: {
      type: String,
      enum: ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees'],
      default: '11-50 employees',
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    gstNumber: {
      type: String,
      default: '',
    },
    contactPerson: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);
