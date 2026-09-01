const Placement = require('../models/Placement');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Record a new placement / offer letter
// @route   POST /api/placements
// @access  Private (Employer / Recruiter / Admin)
const createPlacement = async (req, res, next) => {
  try {
    const { candidateId, jobId, employerId, designation, salary, joiningDate, offerLetterUrl, applicationId } =
      req.body;

    if (!candidateId || !jobId || !designation || !salary || !joiningDate) {
      return sendError(res, 'Candidate, Job, Designation, Salary, and Joining Date are required', 400);
    }

    const placement = await Placement.create({
      candidate: candidateId,
      job: jobId,
      employer: employerId || req.user._id,
      recruiter: req.user.role === 'recruiter' ? req.user._id : undefined,
      designation,
      salary,
      joiningDate,
      offerLetterUrl: offerLetterUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      status: 'offer_received',
    });

    if (applicationId) {
      await JobApplication.findByIdAndUpdate(applicationId, {
        status: 'selected',
        selectedDate: new Date(),
      });
    }

    // Send high-priority notification to candidate
    await Notification.create({
      user: candidateId,
      title: '🎉 Placement Offer Received!',
      message: `Congratulations! You have received a placement offer for ${designation} at CTC ₹${salary.toLocaleString('en-IN')}.`,
      type: 'placement',
      relatedId: placement._id.toString(),
    });

    return sendSuccess(res, 'Placement recorded successfully', placement, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get placements
// @route   GET /api/placements
// @access  Private (Role-based)
const getPlacements = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'candidate') {
      query.candidate = req.user._id;
    } else if (req.user.role === 'employer') {
      query.employer = req.user._id;
    }

    const placements = await Placement.find(query)
      .populate('job', 'title location salary category')
      .populate('candidate', 'name email phone avatar')
      .populate('employer', 'name email avatar')
      .sort({ placementDate: -1 });

    return sendSuccess(res, 'Placements retrieved', placements);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single placement
// @route   GET /api/placements/:id
// @access  Private
const getPlacementById = async (req, res, next) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email phone avatar')
      .populate('employer', 'name email avatar');

    if (!placement) {
      return sendError(res, 'Placement record not found', 404);
    }
    return sendSuccess(res, 'Placement retrieved', placement);
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement status (offer_received, accepted, joined, declined)
// @route   PATCH /api/placements/:id/status
// @access  Private
const updatePlacementStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['offer_received', 'accepted', 'joined', 'declined'];

    if (!allowed.includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const placement = await Placement.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!placement) {
      return sendError(res, 'Placement not found', 404);
    }

    return sendSuccess(res, `Placement status updated to ${status}`, placement);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlacement,
  getPlacements,
  getPlacementById,
  updatePlacementStatus,
};
