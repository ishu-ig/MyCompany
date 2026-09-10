const Interview = require('../models/Interview');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { sendInterviewScheduledEmail } = require('../utils/mailer');

const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private (Employer / Recruiter / Admin)
const scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      jobTitle,
      employerId,
      employerName,
      interviewType = 'HR Round',
      interviewMode = 'Online (Video)',
      scheduledDate,
      scheduledTime,
      meetingLink,
      location,
      interviewerName,
    } = req.body;

    let targetCandidateId = candidateId;
    let targetJobId = jobId;

    if (!targetCandidateId && candidateEmail) {
      let user = await User.findOne({ email: candidateEmail });
      if (!user) {
        user = await User.create({
          name: candidateName || 'Interview Candidate',
          email: candidateEmail,
          password: 'Password123!',
          role: 'candidate',
        });
      }
      targetCandidateId = user._id;
    } else if (!targetCandidateId) {
      const defaultUser = await User.findOne({ role: 'candidate' });
      targetCandidateId = defaultUser ? defaultUser._id : req.user._id;
    }

    if (!targetJobId && jobTitle) {
      const job = await Job.findOne({ title: { $regex: jobTitle, $options: 'i' } });
      if (job) targetJobId = job._id;
    }
    if (!targetJobId) {
      const firstJob = await Job.findOne();
      if (firstJob) targetJobId = firstJob._id;
    }

    const finalDate = scheduledDate || new Date();
    const finalTime = scheduledTime || '11:00 AM';

    const interview = await Interview.create({
      application: applicationId,
      job: targetJobId,
      candidate: targetCandidateId,
      employer: employerId || req.user._id,
      recruiter: req.user.role === 'recruiter' ? req.user._id : undefined,
      interviewType,
      interviewMode,
      scheduledDate: finalDate,
      scheduledTime: finalTime,
      meetingLink: meetingLink || 'https://meet.google.com/xyz-placement-interview',
      location: location || 'Online Video Link',
      interviewerName: interviewerName || employerName || req.user.name,
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
    if (targetCandidateId) {
      const candidateUser = await User.findById(targetCandidateId);
      const targetJob = targetJobId ? await Job.findById(targetJobId) : null;

      await Notification.create({
        user: targetCandidateId,
        title: 'Interview Scheduled! 📅',
        message: `You have an interview scheduled for ${finalDate} at ${finalTime} (${interviewType}).`,
        type: 'interview',
        relatedId: interview._id.toString(),
      });

      if (candidateUser && candidateUser.email) {
        sendInterviewScheduledEmail({
          candidateName: candidateUser.name,
          candidateEmail: candidateUser.email,
          jobTitle: targetJob?.title || jobTitle || 'Position',
          interviewType,
          scheduledDate: finalDate,
          scheduledTime: finalTime,
          meetingLink: interview.meetingLink,
        }).catch((err) => console.error('Interview schedule email error:', err));
      }
    }

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
