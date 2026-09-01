const TrainerProfile = require('../models/TrainerProfile');
const TrainingCourse = require('../models/TrainingCourse');
const CourseEnrollment = require('../models/CourseEnrollment');
const Attendance = require('../models/Attendance');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get current trainer profile
// @route   GET /api/trainers/me
// @access  Private (Trainer)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await TrainerProfile.findOne({ user: req.user._id })
      .populate('user', 'name email phone avatar')
      .populate('assignedCourses');

    if (!profile) {
      profile = await TrainerProfile.create({ user: req.user._id });
    }
    return sendSuccess(res, 'Trainer profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update current trainer profile
// @route   PUT /api/trainers/me
// @access  Private (Trainer)
const updateMyProfile = async (req, res, next) => {
  try {
    let profile = await TrainerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new TrainerProfile({ user: req.user._id });
    }

    const { specialization, experience, qualification, certifications, bio } = req.body;
    if (specialization !== undefined) profile.specialization = specialization;
    if (experience !== undefined) profile.experience = experience;
    if (qualification !== undefined) profile.qualification = qualification;
    if (certifications !== undefined) profile.certifications = certifications;
    if (bio !== undefined) profile.bio = bio;

    await profile.save();
    const updated = await TrainerProfile.findById(profile._id).populate('user', 'name email phone avatar');
    return sendSuccess(res, 'Trainer profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Public
const getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await TrainerProfile.find({ isActive: true })
      .populate('user', 'name email phone avatar')
      .populate('assignedCourses', 'title category duration');
    return sendSuccess(res, 'Trainers retrieved', trainers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get trainer dashboard statistics
// @route   GET /api/trainers/dashboard/stats
// @access  Private (Trainer)
const getTrainerDashboardStats = async (req, res, next) => {
  try {
    const trainerId = req.user._id;

    const assignedCourses = await TrainingCourse.find({ trainer: trainerId });
    const courseIds = assignedCourses.map((c) => c._id);

    const totalStudents = await CourseEnrollment.countDocuments({ course: { $in: courseIds } });
    const totalAssessments = await Assessment.countDocuments({ course: { $in: courseIds } });
    const totalAttendanceMarked = await Attendance.countDocuments({ trainer: trainerId });

    const recentEnrollments = await CourseEnrollment.find({ course: { $in: courseIds } })
      .populate('candidate', 'name email avatar')
      .populate('course', 'title category')
      .sort({ enrollmentDate: -1 })
      .limit(6);

    return sendSuccess(res, 'Trainer dashboard stats loaded', {
      assignedCoursesCount: assignedCourses.length,
      totalStudents,
      totalAssessments,
      totalAttendanceMarked,
      assignedCourses,
      recentEnrollments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllTrainers,
  getTrainerDashboardStats,
};
