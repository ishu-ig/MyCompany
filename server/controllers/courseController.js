const TrainingCourse = require('../models/TrainingCourse');
const CourseEnrollment = require('../models/CourseEnrollment');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.floor(1000 + Math.random() * 9000)
  );
};

// @desc    Get all training courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const {
      category,
      mode,
      skillLevel,
      keyword,
      status = 'published',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (mode && mode !== 'All') {
      query.mode = mode;
    }
    if (skillLevel && skillLevel !== 'All') {
      query.skillLevel = skillLevel;
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { shortDescription: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await TrainingCourse.countDocuments(query);
    const courses = await TrainingCourse.find(query)
      .populate('trainer', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, 'Courses retrieved', courses, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await TrainingCourse.findById(req.params.id).populate('trainer', 'name email avatar');
    if (!course) {
      return sendError(res, 'Course not found', 404);
    }
    return sendSuccess(res, 'Course retrieved', course);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await TrainingCourse.findOne({ slug: req.params.slug }).populate('trainer', 'name email avatar');
    if (!course) {
      return sendError(res, 'Course not found', 404);
    }
    return sendSuccess(res, 'Course retrieved', course);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin / Trainer)
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      category,
      shortDescription,
      description,
      thumbnail,
      duration,
      mode,
      skillLevel,
      eligibility,
      trainer,
      syllabus,
      careerOpportunities,
      practicalAssignments,
      certificateAvailable,
      placementAssistance,
      price,
      discountPrice,
      totalSeats,
      startDate,
      endDate,
      status = 'published',
    } = req.body;

    if (!title || !category || !shortDescription || !description) {
      return sendError(res, 'Please provide title, category, and descriptions', 400);
    }

    const slug = generateSlug(title);

    const course = await TrainingCourse.create({
      title,
      slug,
      category,
      shortDescription,
      description,
      thumbnail,
      duration,
      mode,
      skillLevel,
      eligibility,
      trainer: trainer || req.user._id,
      syllabus,
      careerOpportunities,
      practicalAssignments,
      certificateAvailable,
      placementAssistance,
      price,
      discountPrice,
      totalSeats: totalSeats || 40,
      availableSeats: totalSeats || 40,
      startDate,
      endDate,
      status,
    });

    return sendSuccess(res, 'Training course created successfully', course, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin / Assigned Trainer)
const updateCourse = async (req, res, next) => {
  try {
    const course = await TrainingCourse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return sendError(res, 'Course not found', 404);
    }
    return sendSuccess(res, 'Course updated successfully', course);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await TrainingCourse.findByIdAndDelete(req.params.id);
    if (!course) {
      return sendError(res, 'Course not found', 404);
    }
    return sendSuccess(res, 'Course deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
};
