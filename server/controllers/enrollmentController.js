const CourseEnrollment = require('../models/CourseEnrollment');
const TrainingCourse = require('../models/TrainingCourse');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Enroll candidate in a course
// @route   POST /api/enrollments
// @access  Private (Candidate)
const enrollCourse = async (req, res, next) => {
  try {
    const { courseId, paymentStatus = 'paid' } = req.body;

    if (!courseId) {
      return sendError(res, 'Course ID is required', 400);
    }

    const course = await TrainingCourse.findById(courseId);
    if (!course) {
      return sendError(res, 'Training course not found', 404);
    }

    const existing = await CourseEnrollment.findOne({ course: courseId, candidate: req.user._id });
    if (existing) {
      return sendSuccess(res, 'You are already enrolled in this training program', existing);
    }

    if (course.availableSeats > 0) {
      course.availableSeats -= 1;
      await course.save();
    }

    const enrollment = await CourseEnrollment.create({
      course: courseId,
      candidate: req.user._id,
      paymentStatus,
      courseStatus: 'in_progress',
      progress: 10,
      attendance: 100,
    });

    await Notification.create({
      user: req.user._id,
      title: 'Course Enrollment Confirmed',
      message: `Welcome to "${course.title}". Start your non-IT training journey today!`,
      type: 'course',
      relatedId: course._id.toString(),
    });

    return sendSuccess(res, 'Successfully enrolled in course', enrollment, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private (Candidate)
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await CourseEnrollment.find({ candidate: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'trainer', select: 'name email avatar' },
      })
      .sort({ enrollmentDate: -1 });

    return sendSuccess(res, 'Enrolled courses retrieved', enrollments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrollments for a course (Trainer/Admin)
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Trainer/Admin)
const getCourseEnrollments = async (req, res, next) => {
  try {
    const enrollments = await CourseEnrollment.find({ course: req.params.courseId })
      .populate('candidate', 'name email phone avatar')
      .sort({ enrollmentDate: -1 });

    return sendSuccess(res, 'Students list retrieved', enrollments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate progress in course
// @route   PATCH /api/enrollments/:id/progress
// @access  Private (Trainer/Admin/Candidate)
const updateEnrollmentProgress = async (req, res, next) => {
  try {
    const { progress, courseStatus, attendance, assessmentScore, certificateUrl, placementEligible } = req.body;

    const enrollment = await CourseEnrollment.findById(req.params.id);
    if (!enrollment) {
      return sendError(res, 'Enrollment record not found', 404);
    }

    if (progress !== undefined) enrollment.progress = progress;
    if (courseStatus !== undefined) enrollment.courseStatus = courseStatus;
    if (attendance !== undefined) enrollment.attendance = attendance;
    if (assessmentScore !== undefined) enrollment.assessmentScore = assessmentScore;
    if (certificateUrl !== undefined) enrollment.certificateUrl = certificateUrl;
    if (placementEligible !== undefined) enrollment.placementEligible = placementEligible;

    if (progress === 100 && enrollment.courseStatus !== 'completed') {
      enrollment.courseStatus = 'completed';
    }

    await enrollment.save();
    return sendSuccess(res, 'Progress updated successfully', enrollment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  getCourseEnrollments,
  updateEnrollmentProgress,
};
