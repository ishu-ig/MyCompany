const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const EmployerProfile = require('../models/EmployerProfile');
const CollegeProfile = require('../models/CollegeProfile');
const TrainerProfile = require('../models/TrainerProfile');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const TrainingCourse = require('../models/TrainingCourse');
const CourseEnrollment = require('../models/CourseEnrollment');
const Interview = require('../models/Interview');
const Placement = require('../models/Placement');
const RecruitmentRequest = require('../models/RecruitmentRequest');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get master admin dashboard statistics & chart metrics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalColleges = await User.countDocuments({ role: 'college' });

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await JobApplication.countDocuments();
    const totalCourses = await TrainingCourse.countDocuments();
    const totalEnrollments = await CourseEnrollment.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalPlacements = await Placement.countDocuments();
    const totalRequests = await RecruitmentRequest.countDocuments();

    // Calculate approximate training revenue
    const enrollmentsWithCourses = await CourseEnrollment.find({ paymentStatus: 'paid' }).populate('course', 'price discountPrice');
    const totalRevenue = enrollmentsWithCourses.reduce((acc, curr) => {
      const courseFee = curr.course?.discountPrice || curr.course?.price || 9999;
      return acc + courseFee;
    }, 0);

    // Mock/Real monthly trends for charts
    const monthlyRegistrations = [
      { month: 'Jan', candidates: 45, employers: 12, placements: 18 },
      { month: 'Feb', candidates: 78, employers: 18, placements: 32 },
      { month: 'Mar', candidates: 120, employers: 24, placements: 45 },
      { month: 'Apr', candidates: 160, employers: 30, placements: 68 },
      { month: 'May', candidates: 210, employers: 42, placements: 94 },
      { month: 'Jun', candidates: 290, employers: 56, placements: 140 },
    ];

    const categoryDistribution = [
      { name: 'Business Executive', value: 35 },
      { name: 'HR Executive', value: 25 },
      { name: 'Sales & Marketing', value: 20 },
      { name: 'Operations', value: 12 },
      { name: 'Finance & Accounts', value: 8 },
    ];

    return sendSuccess(res, 'Admin dashboard metrics retrieved', {
      counts: {
        totalUsers,
        totalCandidates,
        totalEmployers,
        totalRecruiters,
        totalTrainers,
        totalColleges,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCourses,
        totalEnrollments,
        totalInterviews,
        totalPlacements,
        totalRequests,
        totalRevenue,
      },
      charts: {
        monthlyRegistrations,
        categoryDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, keyword, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    return sendSuccess(res, 'Users retrieved', users, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active / inactive status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, `User account ${user.isActive ? 'activated' : 'deactivated'}`, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    // Clean up corresponding role profile
    await CandidateProfile.deleteOne({ user: user._id });
    await EmployerProfile.deleteOne({ user: user._id });
    await CollegeProfile.deleteOne({ user: user._id });
    await TrainerProfile.deleteOne({ user: user._id });

    return sendSuccess(res, 'User and associated data deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
};
