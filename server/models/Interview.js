const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobApplication',
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
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
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    interviewType: {
      type: String,
      enum: ['Screening', 'Technical', 'HR Round', 'Managerial', 'Final Round'],
      default: 'HR Round',
    },
    interviewMode: {
      type: String,
      enum: ['Online (Video)', 'In-person', 'Telephonic'],
      default: 'Online (Video)',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/xyz-placement-interview',
    },
    location: {
      type: String,
      default: 'Online Video Conference',
    },
    interviewerName: {
      type: String,
      default: 'Hiring Team',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled', 'selected', 'rejected'],
      default: 'scheduled',
      index: true,
    },
    feedback: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
