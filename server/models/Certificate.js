const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingCourse',
      required: true,
      index: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    grade: {
      type: String,
      enum: ['Distinction', 'First Class', 'Passed'],
      default: 'First Class',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);