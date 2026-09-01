const mongoose = require('mongoose');

const collegeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    university: {
      type: String,
      default: '',
    },
    collegeType: {
      type: String,
      enum: ['Engineering', 'Management', 'Arts & Science', 'Commerce', 'Polytechnic', 'University / Autonomous', 'Other'],
      default: 'Management',
    },
    website: {
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
    phone: {
      type: String,
      default: '',
    },
    email: {
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
    numberOfStudents: {
      type: Number,
      default: 500,
    },
    coursesOffered: {
      type: [String],
      default: ['BBA', 'B.Com', 'MBA', 'BA', 'B.Sc'],
    },
    placementCoordinator: {
      type: String,
      default: '',
    },
    partnershipStatus: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'active',
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

module.exports = mongoose.model('CollegeProfile', collegeProfileSchema);
