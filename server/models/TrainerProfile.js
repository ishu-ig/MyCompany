const mongoose = require('mongoose');

const trainerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    specialization: {
      type: [String],
      default: ['HR & Recruitment', 'Business Development', 'Sales Strategy', 'Soft Skills'],
    },
    experience: {
      type: Number,
      default: 5,
    },
    qualification: {
      type: String,
      default: 'MBA / Corporate Specialist',
    },
    certifications: {
      type: [String],
      default: ['Certified Corporate Trainer', 'SHRM-CP'],
    },
    bio: {
      type: String,
      default: 'Experienced Non-IT Corporate Trainer with a track record of grooming candidates for high-performance sales, HR, and business operations roles.',
    },
    assignedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingCourse',
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TrainerProfile', trainerProfileSchema);
