const RecruitmentRequest = require('../models/RecruitmentRequest');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Submit a recruitment request (Bulk / Non-IT / Campus)
// @route   POST /api/recruitment-requests
// @access  Private (Employer/Admin)
const createRecruitmentRequest = async (req, res, next) => {
  try {
    const {
      jobTitle,
      department,
      numberOfOpenings,
      experience,
      salaryRange,
      location,
      requiredSkills,
      qualification,
      expectedJoiningDate,
      description,
    } = req.body;

    if (!jobTitle || !numberOfOpenings || !location || !description) {
      return sendError(res, 'Job Title, Openings, Location, and Description are required', 400);
    }

    const request = await RecruitmentRequest.create({
      employer: req.user._id,
      jobTitle,
      department: department || 'Operations',
      numberOfOpenings,
      experience: experience || '0-2 years',
      salaryRange: salaryRange || '₹3,00,000 - ₹5,00,000 P.A.',
      location,
      requiredSkills: requiredSkills || [],
      qualification: qualification || ['Any Graduate'],
      expectedJoiningDate,
      description,
      status: 'new',
    });

    return sendSuccess(res, 'Recruitment request submitted successfully', request, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruitment requests
// @route   GET /api/recruitment-requests
// @access  Private (Employer / Recruiter / Admin)
const getRecruitmentRequests = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'employer') {
      query.employer = req.user._id;
    }

    const requests = await RecruitmentRequest.find(query)
      .populate('employer', 'name email phone avatar')
      .populate('assignedRecruiter', 'name email avatar')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Recruitment requests retrieved', requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruitment request status or assign recruiter
// @route   PATCH /api/recruitment-requests/:id/status
// @access  Private (Recruiter / Admin)
const updateRecruitmentRequestStatus = async (req, res, next) => {
  try {
    const { status, assignedRecruiter } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (assignedRecruiter) updateFields.assignedRecruiter = assignedRecruiter;

    const request = await RecruitmentRequest.findByIdAndUpdate(req.params.id, updateFields, { new: true })
      .populate('employer', 'name email')
      .populate('assignedRecruiter', 'name email');

    if (!request) {
      return sendError(res, 'Recruitment request not found', 404);
    }

    return sendSuccess(res, 'Request updated successfully', request);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecruitmentRequest,
  getRecruitmentRequests,
  updateRecruitmentRequestStatus,
};
