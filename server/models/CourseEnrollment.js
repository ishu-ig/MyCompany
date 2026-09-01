const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingCourse',
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'free', 'refunded'],
      default: 'paid',
    },
    courseStatus: {
      type: String,
      enum: ['enrolled', 'in_progress', 'completed', 'dropped'],
      default: 'in_progress',
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    attendance: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    assessmentScore: {
      type: Number,
      default: 0,
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    placementEligible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

courseEnrollmentSchema.index({ course: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
