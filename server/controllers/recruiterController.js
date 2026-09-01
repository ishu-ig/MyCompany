const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Interview = require('../models/Interview');
const Placement = require('../models/Placement');
const RecruitmentRequest = require('../models/RecruitmentRequest');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get recruiter dashboard statistics
// @route   GET /api/recruiters/dashboard/stats
// @access  Private (Recruiter)
const getRecruiterStats = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    const totalAssignedJobs = await Job.countDocuments({ status: 'active' });
    const pendingApplications = await JobApplication.countDocuments({ status: { $in: ['applied', 'screening'] } });
    const scheduledInterviews = await Interview.countDocuments({ status: 'scheduled' });
    const successfulPlacements = await Placement.countDocuments({ status: { $in: ['accepted', 'joined'] } });
    const openRequests = await RecruitmentRequest.countDocuments({ status: { $in: ['new', 'assigned', 'in_progress'] } });

    const recentApplications = await JobApplication.find()
      .populate('job', 'title location salary')
      .populate('candidate', 'name email avatar phone')
      .populate('employer', 'name')
      .sort({ appliedAt: -1 })
      .limit(6);

    const upcomingInterviews = await Interview.find({ status: 'scheduled' })
      .populate('candidate', 'name email avatar phone')
      .populate('employer', 'name')
      .populate('job', 'title')
      .sort({ scheduledDate: 1 })
      .limit(6);

    return sendSuccess(res, 'Recruiter dashboard statistics loaded', {
      totalAssignedJobs,
      pendingApplications,
      scheduledInterviews,
      successfulPlacements,
      openRequests,
      recentApplications,
      upcomingInterviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecruiterStats,
};
