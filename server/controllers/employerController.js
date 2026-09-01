const EmployerProfile = require('../models/EmployerProfile');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Interview = require('../models/Interview');
const Placement = require('../models/Placement');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get current employer profile
// @route   GET /api/employers/me
// @access  Private (Employer)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await EmployerProfile.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
    if (!profile) {
      profile = await EmployerProfile.create({
        user: req.user._id,
        companyName: req.user.name,
      });
    }
    return sendSuccess(res, 'Employer profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update current employer profile
// @route   PUT /api/employers/me
// @access  Private (Employer)
const updateMyProfile = async (req, res, next) => {
  try {
    let profile = await EmployerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new EmployerProfile({ user: req.user._id, companyName: req.user.name });
    }

    const fields = [
      'companyName',
      'companyLogo',
      'website',
      'industry',
      'companySize',
      'description',
      'address',
      'city',
      'state',
      'country',
      'gstNumber',
      'contactPerson',
      'designation',
      'socialLinks',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();
    const updated = await EmployerProfile.findById(profile._id).populate('user', 'name email phone avatar');
    return sendSuccess(res, 'Employer profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employers (Public directory)
// @route   GET /api/employers
// @access  Public
const getAllEmployers = async (req, res, next) => {
  try {
    const { keyword, industry, city, page = 1, limit = 12 } = req.query;
    const query = {};

    if (keyword) {
      query.companyName = { $regex: keyword, $options: 'i' };
    }
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await EmployerProfile.countDocuments(query);
    const employers = await EmployerProfile.find(query)
      .populate('user', 'name email phone avatar')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Attach open jobs count to each employer
    const employersWithJobs = await Promise.all(
      employers.map(async (emp) => {
        const openJobs = await Job.countDocuments({ employer: emp.user?._id, status: 'active' });
        return {
          ...emp.toObject(),
          openJobsCount: openJobs,
        };
      })
    );

    return sendSuccess(res, 'Employers fetched', employersWithJobs, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employer by ID
// @route   GET /api/employers/:id
// @access  Public
const getEmployerById = async (req, res, next) => {
  try {
    const employer = await EmployerProfile.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!employer) {
      return sendError(res, 'Employer not found', 404);
    }
    const jobs = await Job.find({ employer: employer.user?._id, status: 'active' }).sort({ createdAt: -1 });
    return sendSuccess(res, 'Employer details retrieved', { employer, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer dashboard stats
// @route   GET /api/employers/dashboard/stats
// @access  Private (Employer)
const getEmployerStats = async (req, res, next) => {
  try {
    const employerId = req.user._id;

    const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });
    const totalApplications = await JobApplication.countDocuments({ employer: employerId });
    const shortlistedCandidates = await JobApplication.countDocuments({ employer: employerId, status: 'shortlisted' });
    const interviews = await Interview.countDocuments({ employer: employerId });
    const successfulHires = await Placement.countDocuments({ employer: employerId, status: 'joined' });

    const recentApplications = await JobApplication.find({ employer: employerId })
      .populate('job', 'title location salary')
      .populate('candidate', 'name email phone avatar')
      .sort({ appliedAt: -1 })
      .limit(5);

    const upcomingInterviews = await Interview.find({ employer: employerId, status: 'scheduled' })
      .populate('candidate', 'name email phone avatar')
      .populate('job', 'title')
      .sort({ scheduledDate: 1 })
      .limit(5);

    return sendSuccess(res, 'Dashboard statistics loaded', {
      activeJobs,
      totalApplications,
      shortlistedCandidates,
      interviews,
      successfulHires,
      recentApplications,
      upcomingInterviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllEmployers,
  getEmployerById,
  getEmployerStats,
};
