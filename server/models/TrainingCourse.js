const mongoose = require('mongoose');

const trainingCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        'Business Executive',
        'HR Executive',
        'Sales & Marketing',
        'Business Development',
        'Customer Relationship',
        'Operations Executive',
        'Finance & Accounts',
        'Office Administration',
        'Other',
      ],
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    },
    duration: {
      type: String,
      default: '8 Weeks',
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Hybrid',
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    eligibility: {
      type: String,
      default: 'Any Graduate / Final Year Student / Working Professional',
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    syllabus: [
      {
        moduleTitle: { type: String, required: true },
        topics: { type: [String], default: [] },
      },
    ],
    careerOpportunities: {
      type: [String],
      default: [],
    },
    practicalAssignments: {
      type: [String],
      default: [],
    },
    certificateAvailable: {
      type: Boolean,
      default: true,
    },
    placementAssistance: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: 14999,
    },
    discountPrice: {
      type: Number,
      default: 9999,
    },
    totalSeats: {
      type: Number,
      default: 40,
    },
    availableSeats: {
      type: Number,
      default: 40,
    },
    startDate: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
    endDate: {
      type: Date,
      default: () => new Date(+new Date() + 67 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'ongoing', 'completed'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TrainingCourse', trainingCourseSchema);
