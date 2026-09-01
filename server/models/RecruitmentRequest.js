const mongoose = require('mongoose');

const recruitmentRequestSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'Business Operations',
    },
    numberOfOpenings: {
      type: Number,
      required: true,
      default: 5,
    },
    experience: {
      type: String,
      default: '0-2 years',
    },
    salaryRange: {
      type: String,
      default: '₹3,00,000 - ₹5,00,000 P.A.',
    },
    location: {
      type: String,
      required: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    qualification: {
      type: [String],
      default: ['Any Graduate'],
    },
    expectedJoiningDate: {
      type: Date,
      default: () => new Date(+new Date() + 15 * 24 * 60 * 60 * 1000),
    },
    description: {
      type: String,
      required: true,
    },
    assignedRecruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['new', 'assigned', 'in_progress', 'fulfilled', 'cancelled'],
      default: 'new',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RecruitmentRequest', recruitmentRequestSchema);
