const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Candidate Bootcamp Application / Registration (Public from client)
// @route   POST /api/applications/bootcamp
// @access  Public
const applyBootcampCandidate = async (req, res, next) => {
  try {
    const { fullName, name, email, phone, highestEducation, targetTrack, resumeLink } = req.body;
    const applicantName = fullName || name;

    if (!applicantName || !email) {
      return sendError(res, 'Applicant name and email are required', 400);
    }

    // 1. Find or create candidate user
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      user = await User.create({
        name: applicantName,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        password: 'Candidate@' + Math.random().toString(36).substring(2, 6),
        role: 'candidate',
        isVerified: true,
      });
    }

    // 2. Find or create candidate profile
    let profile = await CandidateProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await CandidateProfile.create({
        user: user._id,
        highestEducation: highestEducation || 'Graduate (Any Stream)',
        preferredRoles: targetTrack ? [targetTrack] : ['Business Development Executive'],
        resumeUrl: resumeLink || '',
        experienceLevel: 'Fresher',
        isLookingForJob: true,
      });
    } else {
      if (resumeLink) profile.resumeUrl = resumeLink;
      if (highestEducation) profile.highestEducation = highestEducation;
      if (targetTrack && !profile.preferredRoles.includes(targetTrack)) {
        profile.preferredRoles.push(targetTrack);
      }
      await profile.save();
    }

    // 3. Find or link to a matching track job/cohort
    let matchingJob = await Job.findOne({
      $or: [
        { category: { $regex: new RegExp(targetTrack || 'Business Executive', 'i') } },
        { title: { $regex: new RegExp(targetTrack || 'Business', 'i') } },
      ],
      status: 'active',
    });

    if (!matchingJob) {
      matchingJob = await Job.findOne({ status: 'active' });
    }

    // 4. Create Job Application
    const application = await JobApplication.create({
      job: matchingJob?._id,
      candidate: user._id,
      employer: matchingJob?.employer,
      resume: resumeLink || profile.resumeUrl || '',
      coverLetter: `Bootcamp Candidate Application for track: ${targetTrack || 'General Track'}. Highest Education: ${highestEducation || 'Graduate'}`,
      status: 'applied',
      appliedAt: new Date(),
    });

    // 5. Send Notification
    await Notification.create({
      user: user._id,
      title: 'Bootcamp Application Received! 🚀',
      message: `Hi ${applicantName}, your application for the ${targetTrack || 'Skill Bootcamp'} track is under review. Our admissions team will reach out shortly.`,
      type: 'application',
      relatedId: application._id.toString(),
    });

    return sendSuccess(
      res,
      'Bootcamp application submitted successfully! Our admissions counselor will schedule your initial screening round.',
      {
        applicationId: application._id,
        candidateName: applicantName,
        targetTrack: targetTrack || 'Business Development Executive',
        email,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
const applyJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    if (!jobId) {
      return sendError(res, 'Job ID is required', 400);
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    if (job.status !== 'active') {
      return sendError(res, 'This job is no longer accepting applications', 400);
    }

    // Check if already applied
    const existing = await JobApplication.findOne({ job: jobId, candidate: req.user._id });
    if (existing) {
      return sendError(res, 'You have already applied for this job', 400);
    }

    // Get candidate profile resume if not passed
    let candidateResume = resume;
    if (!candidateResume) {
      const candidateProfile = await CandidateProfile.findOne({ user: req.user._id });
      candidateResume = candidateProfile?.resumeUrl || '';
    }

    const application = await JobApplication.create({
      job: jobId,
      candidate: req.user._id,
      employer: job.employer,
      resume: candidateResume,
      coverLetter: coverLetter || '',
      status: 'applied',
      appliedAt: new Date(),
    });

    // Create notification for employer
    if (job.employer) {
      await Notification.create({
        user: job.employer,
        title: 'New Job Application',
        message: `${req.user.name} applied for "${job.title}"`,
        type: 'application',
        relatedId: application._id.toString(),
      });
    }

    // Create confirmation notification for candidate
    await Notification.create({
      user: req.user._id,
      title: 'Application Submitted',
      message: `Your application for "${job.title}" has been received.`,
      type: 'application',
      relatedId: application._id.toString(),
    });

    return sendSuccess(res, 'Applied for job successfully', application, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's submitted applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ candidate: req.user._id })
      .populate('job', 'title slug location category salary employmentType status')
      .populate('employer', 'name email avatar')
      .sort({ appliedAt: -1 });

    return sendSuccess(res, 'My applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job (Employer/Recruiter/Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;

    const query = { job: jobId };
    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .populate('candidate', 'name email phone avatar')
      .sort({ appliedAt: -1 });

    // Fetch candidate profiles for skills/experience
    const populated = await Promise.all(
      applications.map(async (app) => {
        const profile = await CandidateProfile.findOne({ user: app.candidate?._id });
        return {
          ...app.toObject(),
          candidateProfile: profile,
        };
      })
    );

    return sendSuccess(res, 'Applications for job retrieved', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (For employer portal / recruiter portal / admin)
// @route   GET /api/applications
// @access  Private (Employer/Recruiter/Admin)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (req.user && req.user.role === 'employer') {
      query.employer = req.user._id;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await JobApplication.countDocuments(query);
    const applications = await JobApplication.find(query)
      .populate('job', 'title location salary category')
      .populate('candidate', 'name email phone avatar')
      .populate('employer', 'name')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const enriched = await Promise.all(
      applications.map(async (app) => {
        const profile = await CandidateProfile.findOne({ user: app.candidate?._id });
        return {
          ...app.toObject(),
          candidateProfile: profile,
        };
      })
    );

    return sendSuccess(res, 'Applications retrieved', enriched, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email phone avatar')
      .populate('employer', 'name email avatar');

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    const profile = await CandidateProfile.findOne({ user: application.candidate?._id });
    return sendSuccess(res, 'Application details retrieved', {
      ...application.toObject(),
      candidateProfile: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer / Recruiter / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterNotes } = req.body;
    const allowed = ['applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected', 'joined'];

    if (!allowed.includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const updateFields = { status };
    if (recruiterNotes !== undefined) updateFields.recruiterNotes = recruiterNotes;
    if (status === 'screening') updateFields.screeningDate = new Date();
    if (status === 'interview') updateFields.interviewDate = new Date();
    if (status === 'selected') updateFields.selectedDate = new Date();
    if (status === 'joined') updateFields.joiningDate = new Date();

    const application = await JobApplication.findByIdAndUpdate(req.params.id, updateFields, { new: true })
      .populate('job', 'title')
      .populate('candidate', 'name email');

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    // Send notification to candidate
    if (application.candidate) {
      await Notification.create({
        user: application.candidate._id,
        title: 'Application Status Updated',
        message: `Your application for "${application.job?.title || 'Training Cohort'}" status changed to ${status.toUpperCase()}`,
        type: 'application',
        relatedId: application._id.toString(),
      });
    }

    return sendSuccess(res, `Application status updated to ${status}`, application);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyBootcampCandidate,
  applyJob,
  getMyApplications,
  getJobApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
};
