const CollegeProfile = require('../models/CollegeProfile');
const ContactEnquiry = require('../models/ContactEnquiry');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get current college profile
// @route   GET /api/colleges/me
// @access  Private (College)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await CollegeProfile.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
    if (!profile) {
      profile = await CollegeProfile.create({ user: req.user._id, collegeName: req.user.name });
    }
    return sendSuccess(res, 'College profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update college profile
// @route   PUT /api/colleges/me
// @access  Private (College)
const updateMyProfile = async (req, res, next) => {
  try {
    let profile = await CollegeProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CollegeProfile({ user: req.user._id, collegeName: req.user.name });
    }

    const fields = [
      'collegeName',
      'university',
      'collegeType',
      'website',
      'contactPerson',
      'designation',
      'phone',
      'email',
      'city',
      'state',
      'numberOfStudents',
      'coursesOffered',
      'placementCoordinator',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();
    const updated = await CollegeProfile.findById(profile._id).populate('user', 'name email phone avatar');
    return sendSuccess(res, 'College profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all colleges (Public / Partner directory)
// @route   GET /api/colleges
// @access  Public
const getAllColleges = async (req, res, next) => {
  try {
    const { keyword, city, type } = req.query;
    const query = {};

    if (keyword) query.collegeName = { $regex: keyword, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (type) query.collegeType = type;

    const colleges = await CollegeProfile.find(query).populate('user', 'name email phone avatar');
    return sendSuccess(res, 'Colleges retrieved', colleges);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit campus training or placement drive request
// @route   POST /api/colleges/training-request
// @access  Private (College)
const submitTrainingRequest = async (req, res, next) => {
  try {
    const { service, expectedStudents, preferredDate, subject, message } = req.body;

    const enquiry = await ContactEnquiry.create({
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      userType: 'college',
      service: service || 'Campus Training / Placement Drive',
      subject: subject || `Placement Drive Request: ${req.user.name} (${expectedStudents || 'All'} Students)`,
      message: `${message}\n\n[Preferred Date: ${preferredDate || 'N/A'}]`,
    });

    return sendSuccess(res, 'Campus training request submitted successfully. Our corporate team will get in touch.', enquiry, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllColleges,
  submitTrainingRequest,
};
