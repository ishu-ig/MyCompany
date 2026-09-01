const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
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
    designation: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    offerLetterUrl: {
      type: String,
      default: '',
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    placementDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['offer_received', 'accepted', 'joined', 'declined'],
      default: 'offer_received',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Placement', placementSchema);
