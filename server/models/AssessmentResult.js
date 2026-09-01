const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['passed', 'failed'],
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedOption: Number,
        isCorrect: Boolean,
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

assessmentResultSchema.index({ assessment: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
