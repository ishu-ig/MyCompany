const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      default: 'Job Seeker / Trainee',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Male',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
      index: true,
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    education: [
      {
        degree: { type: String, required: true },
        specialization: { type: String },
        college: { type: String, required: true },
        university: { type: String },
        startYear: { type: Number },
        passingYear: { type: Number },
        percentage: { type: Number },
        cgpa: { type: Number },
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        designation: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        currentlyWorking: { type: Boolean, default: false },
        description: { type: String },
      },
    ],
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    certifications: [
      {
        name: { type: String, required: true },
        organization: { type: String, required: true },
        issueDate: { type: Date },
        credentialUrl: { type: String },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        technologies: { type: [String], default: [] },
        projectUrl: { type: String },
      },
    ],
    preferredJobRoles: {
      type: [String],
      default: [],
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    currentSalary: {
      type: Number,
      default: 0,
    },
    expectedSalary: {
      type: Number,
      default: 0,
    },
    noticePeriod: {
      type: String,
      default: 'Immediate',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    profileCompletion: {
      type: Number,
      default: 30,
    },
    isAvailableForJob: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
