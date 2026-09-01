const SavedJob = require('../models/SavedJob');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private (Candidate)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return sendError(res, 'Job ID is required', 400);
    }

    const existing = await SavedJob.findOne({ candidate: req.user._id, job: jobId });
    if (existing) {
      return sendSuccess(res, 'Job is already saved', existing);
    }

    const saved = await SavedJob.create({
      candidate: req.user._id,
      job: jobId,
    });

    return sendSuccess(res, 'Job saved successfully', saved, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Candidate)
const removeSavedJob = async (req, res, next) => {
  try {
    await SavedJob.findOneAndDelete({ candidate: req.user._id, job: req.params.jobId });
    return sendSuccess(res, 'Job removed from saved list');
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Candidate)
const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'employer', select: 'name email avatar' },
      })
      .sort({ createdAt: -1 });

    const validJobs = savedJobs.filter((s) => s.job !== null);
    return sendSuccess(res, 'Saved jobs retrieved', validJobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveJob,
  removeSavedJob,
  getSavedJobs,
};
