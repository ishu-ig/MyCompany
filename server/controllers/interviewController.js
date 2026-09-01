const Interview = require('../models/Interview');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private (Employer / Recruiter / Admin)
const scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      jobId,
      candidateId,
      employerId,
      interviewType = 'HR Round',
      interviewMode = 'Online (Video)',
      scheduledDate,
      scheduledTime,
      meetingLink,
      location,
      interviewerName,
    } = req.body;

    if (!jobId || !candidateId || !scheduledDate || !scheduledTime) {
      return sendError(res, 'Job, Candidate, Scheduled Date, and Scheduled Time are required', 400);
    }

    const interview = await Interview.create({
      application: applicationId,
      job: jobId,
      candidate: candidateId,
      employer: employerId || req.user._id,
      recruiter: req.user.role === 'recruiter' ? req.user._id : undefined,
      interviewType,
      interviewMode,
      scheduledDate,
      scheduledTime,
      meetingLink: meetingLink || 'https://meet.google.com/xyz-placement-interview',
      location: location || 'Online Video Link',
      interviewerName: interviewerName || req.user.name,
      status: 'scheduled',
    });

    // If applicationId provided, update application status to 'interview'
    if (applicationId) {
      await JobApplication.findByIdAndUpdate(applicationId, {
        status: 'interview',
        interviewDate: new Date(scheduledDate),
      });
    }

    // Send notification to candidate
    await Notification.create({
      user: candidateId,
      title: 'Interview Scheduled! 📅',
      message: `You have an interview scheduled for ${scheduledDate} at ${scheduledTime} (${interviewType}).`,
      type: 'interview',
      relatedId: interview._id.toString(),
    });

    return sendSuccess(res, 'Interview scheduled successfully', interview, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get interviews (Role filtered)
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'candidate') {
      query.candidate = req.user._id;
    } else if (req.user.role === 'employer') {
      query.employer = req.user._id;
    } else if (req.user.role === 'recruiter') {
      // Recruiters see all or their assigned interviews
    }

    const interviews = await Interview.find(query)
      .populate('job', 'title location salary category')
      .populate('candidate', 'name email phone avatar')
      .populate('employer', 'name email avatar')
      .sort({ scheduledDate: 1 });

    return sendSuccess(res, 'Interviews retrieved', interviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email phone avatar')
      .populate('employer', 'name email avatar');

    if (!interview) {
      return sendError(res, 'Interview not found', 404);
    }
    return sendSuccess(res, 'Interview retrieved', interview);
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview status, rating, or feedback
// @route   PATCH /api/interviews/:id/status
// @access  Private (Employer / Recruiter / Admin)
const updateInterviewStatus = async (req, res, next) => {
  try {
    const { status, feedback, rating, scheduledDate, scheduledTime, meetingLink } = req.body;

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return sendError(res, 'Interview not found', 404);
    }

    if (status !== undefined) interview.status = status;
    if (feedback !== undefined) interview.feedback = feedback;
    if (rating !== undefined) interview.rating = rating;
    if (scheduledDate !== undefined) interview.scheduledDate = scheduledDate;
    if (scheduledTime !== undefined) interview.scheduledTime = scheduledTime;
    if (meetingLink !== undefined) interview.meetingLink = meetingLink;

    await interview.save();

    // If selected or rejected, also update application
    if (interview.application && (status === 'selected' || status === 'rejected')) {
      await JobApplication.findByIdAndUpdate(interview.application, {
        status,
        ...(status === 'selected' && { selectedDate: new Date() }),
      });
    }

    // Send notification
    await Notification.create({
      user: interview.candidate,
      title: `Interview Status: ${status?.toUpperCase()}`,
      message: `Your interview update: Status is now ${status}. ${feedback ? 'Feedback: ' + feedback : ''}`,
      type: 'interview',
      relatedId: interview._id.toString(),
    });

    return sendSuccess(res, 'Interview updated successfully', interview);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterviewStatus,
};
