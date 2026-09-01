const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      type: String,
      default: '',
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected', 'joined'],
      default: 'applied',
      index: true,
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    screeningDate: {
      type: Date,
    },
    interviewDate: {
      type: Date,
    },
    selectedDate: {
      type: Date,
    },
    joiningDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application by same candidate to same job
jobApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
